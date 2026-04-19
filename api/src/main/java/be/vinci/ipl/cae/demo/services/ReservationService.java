package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.models.dtos.CreateReservationLineRequest;
import be.vinci.ipl.cae.demo.models.dtos.CreateReservationRequest;
import be.vinci.ipl.cae.demo.models.entities.Reservation;
import be.vinci.ipl.cae.demo.models.entities.ReservationLines;
import be.vinci.ipl.cae.demo.models.entities.ReservationStatus;
import be.vinci.ipl.cae.demo.models.entities.Service;
import be.vinci.ipl.cae.demo.models.entities.ServiceStatus;
import be.vinci.ipl.cae.demo.models.entities.User;
import be.vinci.ipl.cae.demo.repositories.ReservationLinesRepository;
import be.vinci.ipl.cae.demo.repositories.ReservationRepository;
import be.vinci.ipl.cae.demo.repositories.ServiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Service
public class ReservationService {

  private final ReservationRepository reservationRepository;
  private final ReservationLinesRepository reservationLinesRepository;
  private final ServiceRepository serviceRepository;
  private final AuthService authService;

  public ReservationService(ReservationRepository reservationRepository,
							ReservationLinesRepository reservationLinesRepository,
							ServiceRepository serviceRepository,
							AuthService authService) {
	this.reservationRepository = reservationRepository;
	this.reservationLinesRepository = reservationLinesRepository;
	this.serviceRepository = serviceRepository;
	this.authService = authService;
  }

  public Reservation createReservation(CreateReservationRequest request, String userEmail) {
	validateCreateRequest(request);

	User client = getAuthenticatedUser(userEmail);

	Reservation reservation = new Reservation();
	reservation.setClient(client);
	reservation.setReservationDate(request.reservationDate);
	reservation.setStatus(ReservationStatus.FUTUR);
	reservation.setTotal_price(0);

	Reservation savedReservation = reservationRepository.save(reservation);

	double totalPrice = 0;
	List<ReservationLines> lines = new ArrayList<>();

	for (CreateReservationLineRequest lineRequest : request.lines) {
	  if (lineRequest == null || lineRequest.serviceId == null) {
		throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each line must define a serviceId");
	  }

	  Service service = serviceRepository.findById(lineRequest.serviceId)
			  .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

	  if (service.getStatus() != ServiceStatus.VALIDATED) {
		throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only VALIDATED services can be reserved");
	  }

	  ReservationLines line = new ReservationLines();
	  line.setClient(client);
	  line.setReservation(savedReservation);
	  line.setService(service);
	  line.setDate(lineRequest.date != null ? lineRequest.date : request.reservationDate);
	  lines.add(line);

	  totalPrice += service.getPrice();
	}

	reservationLinesRepository.saveAll(lines);
	savedReservation.setTotal_price(totalPrice);
	return reservationRepository.save(savedReservation);
  }

  public Reservation cancelReservation(Long reservationId, String userEmail) {
	User client = getAuthenticatedUser(userEmail);

	Reservation reservation = reservationRepository.findByIdAndClient(reservationId, client)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));

	if (reservation.getStatus() == ReservationStatus.CANCELED) {
	  throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation is already canceled");
	}

	LocalDateTime cancellationLimit = LocalDateTime.now().plusHours(48);
	if (cancellationLimit.isAfter(reservation.getReservationDate())) {
	  throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
			  "Reservation can only be canceled at least 48h in advance");
	}

	reservation.setStatus(ReservationStatus.CANCELED);
	return reservationRepository.save(reservation);
  }

  public List<Reservation> getMyReservations(String userEmail) {
	User client = getAuthenticatedUser(userEmail);
	return reservationRepository.findAllByClientOrderByReservationDateDesc(client);
  }

  private User getAuthenticatedUser(String userEmail) {
	User client = authService.findByEmail(userEmail);
	if (client == null) {
	  throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
	}
	return client;
  }

  private void validateCreateRequest(CreateReservationRequest request) {
	if (request == null) {
	  throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
	}
	if (request.reservationDate == null) {
	  throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reservationDate is required");
	}
	if (request.lines == null || request.lines.isEmpty()) {
	  throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one reservation line is required");
	}
  }


}

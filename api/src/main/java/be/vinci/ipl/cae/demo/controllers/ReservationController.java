package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.models.dtos.CreateReservationRequest;
import be.vinci.ipl.cae.demo.models.entities.Reservation;
import be.vinci.ipl.cae.demo.services.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reservation")
public class ReservationController {

  private final ReservationService reservationService;

  public ReservationController(ReservationService reservationService) {
	this.reservationService = reservationService;
  }

  @PostMapping
  public ResponseEntity<Reservation> createReservation(@Valid @RequestBody CreateReservationRequest request,
													   Authentication authentication) {
	Reservation reservation = reservationService.createReservation(request, authentication.getName());
	return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
  }

  @PatchMapping("/{id}/cancel")
  public ResponseEntity<Reservation> cancelReservation(@PathVariable Long id,
													   Authentication authentication) {
	Reservation reservation = reservationService.cancelReservation(id, authentication.getName());
	return ResponseEntity.ok(reservation);
  }

  @GetMapping("/my")
  public ResponseEntity<List<Reservation>> getMyReservations(Authentication authentication) {
	List<Reservation> reservations = reservationService.getMyReservations(authentication.getName());
	return ResponseEntity.ok(reservations);
  }
}

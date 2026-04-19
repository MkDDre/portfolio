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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

  @Mock
  private ReservationRepository reservationRepository;

  @Mock
  private ReservationLinesRepository reservationLinesRepository;

  @Mock
  private ServiceRepository serviceRepository;

  @Mock
  private AuthService authService;

  @InjectMocks
  private ReservationService reservationService;

  private User user;

  @BeforeEach
  void setUp() {
    user = new User();
    user.setId(1L);
    user.setEmail("client@test.com");
  }

  @Test
  void createReservationShouldSaveReservationAndLines() {
    CreateReservationRequest request = new CreateReservationRequest();
    request.reservationDate = LocalDateTime.now().plusDays(5);

    CreateReservationLineRequest line1 = new CreateReservationLineRequest();
    line1.serviceId = 10L;

    CreateReservationLineRequest line2 = new CreateReservationLineRequest();
    line2.serviceId = 20L;
    line2.date = request.reservationDate.plusHours(2);

    request.lines = List.of(line1, line2);

    Service service1 = new Service();
    service1.setId(10L);
    service1.setPrice(50.0);
    service1.setStatus(ServiceStatus.VALIDATED);

    Service service2 = new Service();
    service2.setId(20L);
    service2.setPrice(80.0);
    service2.setStatus(ServiceStatus.VALIDATED);

    when(authService.findByEmail("client@test.com")).thenReturn(user);
    when(serviceRepository.findById(10L)).thenReturn(Optional.of(service1));
    when(serviceRepository.findById(20L)).thenReturn(Optional.of(service2));
    when(reservationRepository.save(any(Reservation.class))).thenAnswer(invocation -> invocation.getArgument(0));

    Reservation result = reservationService.createReservation(request, "client@test.com");

    assertEquals(130.0, result.getTotal_price());
    assertEquals(ReservationStatus.FUTUR, result.getStatus());
    assertEquals(user, result.getClient());

    ArgumentCaptor<Iterable<ReservationLines>> linesCaptor = ArgumentCaptor.forClass(Iterable.class);
    verify(reservationLinesRepository).saveAll(linesCaptor.capture());
    int savedLinesCount = 0;
    for (ReservationLines ignored : linesCaptor.getValue()) {
      savedLinesCount++;
    }
    assertEquals(2, savedLinesCount);
  }

  @Test
  void createReservationShouldThrowWhenRequestIsInvalid() {
    CreateReservationRequest request = new CreateReservationRequest();
    request.reservationDate = LocalDateTime.now().plusDays(2);
    request.lines = List.of();

    ResponseStatusException exception = assertThrows(ResponseStatusException.class,
        () -> reservationService.createReservation(request, "client@test.com"));

    assertTrue(exception.getReason().contains("At least one reservation line"));
  }

  @Test
  void cancelReservationShouldSucceedWhenMoreThan48HoursAhead() {
    Reservation reservation = new Reservation();
    reservation.setId(1L);
    reservation.setClient(user);
    reservation.setStatus(ReservationStatus.FUTUR);
    reservation.setReservationDate(LocalDateTime.now().plusDays(3));

    when(authService.findByEmail("client@test.com")).thenReturn(user);
    when(reservationRepository.findByIdAndClient(1L, user)).thenReturn(Optional.of(reservation));
    when(reservationRepository.save(any(Reservation.class))).thenAnswer(invocation -> invocation.getArgument(0));

    Reservation canceled = reservationService.cancelReservation(1L, "client@test.com");

    assertEquals(ReservationStatus.CANCELED, canceled.getStatus());
  }

  @Test
  void cancelReservationShouldFailWhenLessThan48HoursAhead() {
    Reservation reservation = new Reservation();
    reservation.setId(1L);
    reservation.setClient(user);
    reservation.setStatus(ReservationStatus.FUTUR);
    reservation.setReservationDate(LocalDateTime.now().plusHours(47));

    when(authService.findByEmail("client@test.com")).thenReturn(user);
    when(reservationRepository.findByIdAndClient(1L, user)).thenReturn(Optional.of(reservation));

    ResponseStatusException exception = assertThrows(ResponseStatusException.class,
        () -> reservationService.cancelReservation(1L, "client@test.com"));

    assertTrue(exception.getReason().contains("48h"));
  }

  @Test
  void getMyReservationsShouldReturnUserReservations() {
    Reservation first = new Reservation();
    first.setId(3L);

    Reservation second = new Reservation();
    second.setId(2L);

    when(authService.findByEmail("client@test.com")).thenReturn(user);
    when(reservationRepository.findAllByClientOrderByReservationDateDesc(user))
        .thenReturn(List.of(first, second));

    List<Reservation> reservations = reservationService.getMyReservations("client@test.com");

    assertEquals(2, reservations.size());
    assertEquals(3L, reservations.get(0).getId());
    verify(reservationRepository).findAllByClientOrderByReservationDateDesc(user);
  }
}


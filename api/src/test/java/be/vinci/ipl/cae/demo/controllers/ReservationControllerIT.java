package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.configuration.SecurityConfiguration;
import be.vinci.ipl.cae.demo.models.entities.Reservation;
import be.vinci.ipl.cae.demo.models.entities.ReservationStatus;
import be.vinci.ipl.cae.demo.services.ReservationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReservationController.class)
@Import(SecurityConfiguration.class)
class ReservationControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @org.springframework.boot.test.mock.mockito.MockBean
  private ReservationService reservationService;

  @org.springframework.boot.test.mock.mockito.MockBean
  private be.vinci.ipl.cae.demo.configuration.JwtAuthenticationFilter jwtAuthenticationFilter;

  @BeforeEach
  void setUpFilterPassThrough() throws Exception {
    doAnswer(invocation -> {
      ServletRequest request = invocation.getArgument(0);
      ServletResponse response = invocation.getArgument(1);
      FilterChain chain = invocation.getArgument(2);
      chain.doFilter(request, response);
      return null;
    }).when(jwtAuthenticationFilter).doFilter(org.mockito.ArgumentMatchers.any(),
        org.mockito.ArgumentMatchers.any(),
        org.mockito.ArgumentMatchers.any());
  }

  @Test
  @WithMockUser(username = "client@test.com", roles = "CUSTOMER")
  void createReservationShouldReturnCreated() throws Exception {

    Reservation reservation = new Reservation();
    reservation.setId(99L);
    reservation.setReservationDate(LocalDateTime.of(2026, 6, 15, 10, 0));
    reservation.setStatus(ReservationStatus.FUTUR);
    reservation.setTotal_price(120.0);

    when(reservationService.createReservation(org.mockito.ArgumentMatchers.any(), eq("client@test.com")))
        .thenReturn(reservation);

    String body = """
        {
          "reservationDate": "2026-06-15T10:00:00",
          "lines": [
            {"serviceId": 1, "date": "2026-06-15T10:00:00"},
            {"serviceId": 2, "date": "2026-06-15T11:00:00"}
          ]
        }
        """;

    mockMvc.perform(post("/reservation")
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(99L))
        .andExpect(jsonPath("$.total_price").value(120.0));

    verify(reservationService).createReservation(org.mockito.ArgumentMatchers.any(), eq("client@test.com"));
  }

  @Test
  @WithMockUser(username = "client@test.com", roles = "CUSTOMER")
  void cancelReservationShouldReturnOk() throws Exception {
    Reservation reservation = new Reservation();
    reservation.setId(21L);
    reservation.setStatus(ReservationStatus.CANCELED);

    when(reservationService.cancelReservation(21L, "client@test.com")).thenReturn(reservation);

    mockMvc.perform(patch("/reservation/21/cancel"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(21L))
        .andExpect(jsonPath("$.status").value("CANCELED"));

    verify(reservationService).cancelReservation(21L, "client@test.com");
  }

  @Test
  @WithMockUser(username = "client@test.com", roles = "CUSTOMER")
  void getMyReservationsShouldReturnOk() throws Exception {
    Reservation first = new Reservation();
    first.setId(10L);
    first.setStatus(ReservationStatus.FUTUR);
    first.setTotal_price(70.0);
    first.setReservationDate(LocalDateTime.of(2026, 7, 2, 14, 0));

    Reservation second = new Reservation();
    second.setId(9L);
    second.setStatus(ReservationStatus.CANCELED);
    second.setTotal_price(40.0);
    second.setReservationDate(LocalDateTime.of(2026, 6, 20, 9, 0));

    when(reservationService.getMyReservations("client@test.com"))
        .thenReturn(List.of(first, second));

    mockMvc.perform(get("/reservation/my"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(10L))
        .andExpect(jsonPath("$[0].status").value("FUTUR"))
        .andExpect(jsonPath("$[1].id").value(9L))
        .andExpect(jsonPath("$[1].status").value("CANCELED"));

    verify(reservationService).getMyReservations("client@test.com");
  }

  @Test
  void createReservationShouldFailWithoutAuthentication() throws Exception {
    String body = objectMapper.writeValueAsString(java.util.Map.of(
        "reservationDate", "2026-06-15T10:00:00",
        "lines", java.util.List.of(java.util.Map.of("serviceId", 1))
    ));

    mockMvc.perform(post("/reservation")
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "client@test.com", roles = "CUSTOMER")
  void createReservationShouldReturnValidationErrorWhenLinesMissing() throws Exception {
    String body = objectMapper.writeValueAsString(java.util.Map.of(
        "reservationDate", "2026-06-15T10:00:00",
        "lines", java.util.List.of()
    ));

    mockMvc.perform(post("/reservation")
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Validation failed"))
        .andExpect(jsonPath("$.fieldErrors.lines").exists());
  }
}


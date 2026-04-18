package be.vinci.ipl.cae.demo.models.dtos;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class CreateReservationLineRequest {
  @NotNull(message = "serviceId is required")
  public Long serviceId;

  public LocalDateTime date;
}


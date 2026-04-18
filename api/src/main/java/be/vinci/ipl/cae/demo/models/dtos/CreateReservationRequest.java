package be.vinci.ipl.cae.demo.models.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class CreateReservationRequest {
  @NotNull(message = "reservationDate is required")
  public LocalDateTime reservationDate;

  @NotEmpty(message = "At least one reservation line is required")
  @Valid
  public List<CreateReservationLineRequest> lines;
}


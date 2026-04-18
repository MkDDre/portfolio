package be.vinci.ipl.cae.demo.models.dtos;

import java.time.LocalDateTime;
import java.util.List;

public class CreateReservationRequest {
  public LocalDateTime reservationDate;
  public List<CreateReservationLineRequest> lines;
}


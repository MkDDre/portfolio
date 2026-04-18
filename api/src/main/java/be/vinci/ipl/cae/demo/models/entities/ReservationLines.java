package be.vinci.ipl.cae.demo.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Reservation Lines entity.
 */
@Entity
@Table(name = "reservation_lines")
@Data
@NoArgsConstructor
public class ReservationLines {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn
    private User client;

    @ManyToOne
    @JoinColumn
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Service service;

    @Column(nullable = false)
    private LocalDateTime date;
}

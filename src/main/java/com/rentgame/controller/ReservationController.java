package com.rentgame.controller;

import com.rentgame.model.*;
import com.rentgame.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final EquipmentRepository equipmentRepository;

    public ReservationController(
            ReservationRepository reservationRepository,
            UserRepository userRepository,
            GameRepository gameRepository,
            EquipmentRepository equipmentRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.equipmentRepository = equipmentRepository;
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Reservation>> getMyReservations(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        List<Reservation> reservations = reservationRepository.findByUser(user);
        return ResponseEntity.ok(reservations);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> createReservation(@Valid @RequestBody ReservationRequest request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow();

        // ✅ Warunek: wymagane gameId lub equipmentId
        if (request.getGameId() == null && request.getEquipmentId() == null) {
            return ResponseEntity.badRequest().body("Musisz wybrać grę lub sprzęt do rezerwacji.");
        }

        // ✅ Warunek: startDate nie może być w przeszłości
        if (request.getStartDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body("Nie można rezerwować na termin w przeszłości.");
        }

        // Gra
        Game game = null;
        if (request.getGameId() != null) {
            game = gameRepository.findById(request.getGameId()).orElse(null);
            if (game == null) {
                return ResponseEntity.badRequest().body("Gra nie istnieje.");
            }

            if (!game.isAvailable()) {
                return ResponseEntity.badRequest().body("Gra jest oznaczona jako niedostępna przez administratora.");
            }

            List<Reservation> gameConflicts = reservationRepository
                    .findConflictingGameReservations(request.getGameId(), request.getStartDate(), request.getEndDate());

            if (!gameConflicts.isEmpty()) {
                return ResponseEntity.badRequest().body("Gra jest już zarezerwowana w wybranym terminie.");
            }
        }

        // Sprzęt
        Equipment equipment = null;
        if (request.getEquipmentId() != null) {
            equipment = equipmentRepository.findById(request.getEquipmentId()).orElse(null);
            if (equipment == null) {
                return ResponseEntity.badRequest().body("Sprzęt nie istnieje.");
            }

            if (!equipment.isAvailable()) {
                return ResponseEntity.badRequest().body("Sprzęt jest oznaczony jako niedostępny przez administratora.");
            }

            List<Reservation> equipmentConflicts = reservationRepository
                    .findConflictingEquipmentReservations(request.getEquipmentId(), request.getStartDate(), request.getEndDate());

            if (!equipmentConflicts.isEmpty()) {
                return ResponseEntity.badRequest().body("Sprzęt jest już zarezerwowany w wybranym terminie.");
            }
        }

        Reservation reservation = new Reservation(user, game, equipment, request.getStartDate(), request.getEndDate());
        return ResponseEntity.ok(reservationRepository.save(reservation));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id, Authentication authentication) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);

        if (reservation == null) {
            return ResponseEntity.notFound().build();
        }

        String currentUsername = authentication.getName();
        User currentUser = userRepository.findByUsername(currentUsername).orElseThrow();

        boolean isAdmin = currentUser.getRole().equals("ADMIN");
        boolean isOwner = reservation.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            return ResponseEntity.status(403).body("Brak dostępu do tej rezerwacji");
        }

        reservationRepository.delete(reservation);
        return ResponseEntity.ok().body("Rezerwacja anulowana");
    }
}

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

    // POST /api/reservations/games
    @PostMapping("/games")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> createGameReservation(@Valid @RequestBody ReservationRequest request) {
        if (request.getGameId() == null) {
            return ResponseEntity.badRequest().body("Gra musi zostać wybrana.");
        }

        if (request.getStartDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body("Data rozpoczęcia nie może być w przeszłości.");
        }

        User user = userRepository.findById(request.getUserId()).orElseThrow();
        Game game = gameRepository.findById(request.getGameId()).orElse(null);

        if (game == null || !game.isAvailable()) {
            return ResponseEntity.badRequest().body("Gra nie istnieje lub jest niedostępna.");
        }

        var conflicts = reservationRepository.findConflictingGameReservations(
                request.getGameId(), request.getStartDate(), request.getEndDate());

        if (!conflicts.isEmpty()) {
            return ResponseEntity.badRequest().body("Gra już jest zarezerwowana w tym terminie.");
        }

        Reservation reservation = new Reservation(user, game, null, request.getStartDate(), request.getEndDate());
        return ResponseEntity.ok(reservationRepository.save(reservation));
    }

    // POST /api/reservations/equipment
    @PostMapping("/equipment")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> createEquipmentReservation(@Valid @RequestBody ReservationRequest request) {
        if (request.getUserId() == null || request.getEquipmentId() == null) {
            return ResponseEntity.badRequest().body("Brakuje userId lub equipmentId.");
        }

        if (request.getEquipmentId() == null) {
            return ResponseEntity.badRequest().body("Sprzęt musi zostać wybrany.");
        }

        if (request.getStartDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body("Data rozpoczęcia nie może być w przeszłości.");
        }

        User user = userRepository.findById(request.getUserId()).orElseThrow();
        Equipment equipment = equipmentRepository.findById(request.getEquipmentId()).orElse(null);

        if (equipment == null || !equipment.isAvailable()) {
            return ResponseEntity.badRequest().body("Sprzęt nie istnieje lub jest niedostępny.");
        }

        var conflicts = reservationRepository.findConflictingEquipmentReservations(
                request.getEquipmentId(), request.getStartDate(), request.getEndDate());

        if (!conflicts.isEmpty()) {
            return ResponseEntity.badRequest().body("Sprzęt już jest zarezerwowany w tym terminie.");
        }

        Reservation reservation = new Reservation(user, null, equipment, request.getStartDate(), request.getEndDate());
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

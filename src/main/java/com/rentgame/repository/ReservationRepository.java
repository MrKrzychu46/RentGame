package com.rentgame.repository;

import com.rentgame.model.Reservation;
import com.rentgame.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUser(User user);

    @Query("SELECT r FROM Reservation r WHERE " +
            "(r.game.id = :gameId OR r.equipment.id = :equipmentId) " +
            "AND r.endDate >= :startDate AND r.startDate <= :endDate")
    List<Reservation> findConflictingReservations(
            @Param("gameId") Long gameId,
            @Param("equipmentId") Long equipmentId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT r FROM Reservation r WHERE r.game.id = :gameId AND r.endDate >= :startDate AND r.startDate <= :endDate")
    List<Reservation> findConflictingGameReservations(Long gameId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT r FROM Reservation r WHERE r.equipment.id = :equipmentId AND r.endDate >= :startDate AND r.startDate <= :endDate")
    List<Reservation> findConflictingEquipmentReservations(Long equipmentId, LocalDate startDate, LocalDate endDate);


}

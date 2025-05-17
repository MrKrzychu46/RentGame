package com.rentgame.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "app_reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Kto rezerwuje
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Co rezerwuje: gra
    @ManyToOne
    @JoinColumn(name = "game_id", nullable = true)
    private Game game;

    // Co rezerwuje: sprzęt
    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = true)
    private Equipment equipment;

    private LocalDate startDate;
    private LocalDate endDate;

    public Reservation() {}

    public Reservation(User user, Game game, Equipment equipment, LocalDate startDate, LocalDate endDate) {
        this.user = user;
        this.game = game;
        this.equipment = equipment;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}

package com.rentgame.model;

import jakarta.persistence.*;

@Entity
@Table(name = "app_games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String genre;

    @Column(nullable = false)
    private String platform;

    private boolean available;

    // KONSTRUKTORY
    public Game() {}

    public Game(String title, String genre, String platform, boolean available) {
        this.title = title;
        this.genre = genre;
        this.platform = platform;
        this.available = available;
    }

    // GETTERY I SETTERY
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}

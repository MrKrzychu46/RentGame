package com.rentgame.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "app_equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nazwa sprzętu jest wymagana")
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank(message = "Typ sprzętu jest wymagany")
    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private boolean available = true;

    public Equipment() {}

    public Equipment(String name, String type, boolean available) {
        this.name = name;
        this.type = type;
        this.available = available;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}

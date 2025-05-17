package com.rentgame.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "app_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nazwa użytkownika jest wymagana")
    @Column(nullable = false)
    private String username;

    @NotBlank(message = "Email jest wymagany")
    @Email(message = "Nieprawidłowy adres email")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Hasło jest wymagane")
    @Size(min = 6, message = "Hasło musi mieć co najmniej 6 znaków")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "Rola jest wymagana")
    @Column(nullable = false)
    private String role;

    public User() {}

    public User(String username, String email, String password, String role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

package com.rentgame.controller;

import com.rentgame.model.User;
import com.rentgame.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        // Sprawdzenie unikalności
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(
                    Map.of("username", "Nazwa użytkownika jest już zajęta"));
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(
                    Map.of("email", "Email jest już zarejestrowany"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }
}

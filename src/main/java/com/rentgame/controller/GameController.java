package com.rentgame.controller;

import com.rentgame.model.Game;
import com.rentgame.repository.GameRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameRepository gameRepository;

    public GameController(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @GetMapping
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    @PostMapping
    public Game createGame(@RequestBody Game game) {
        return gameRepository.save(game);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteGame(@PathVariable Long id) {
        gameRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestBody Map<String, Boolean> update) {
        Game game = gameRepository.findById(id).orElseThrow();
        Boolean available = update.get("available");
        if (available != null) {
            game.setAvailable(available);
            gameRepository.save(game);
        }
        return ResponseEntity.ok().build();
    }

}


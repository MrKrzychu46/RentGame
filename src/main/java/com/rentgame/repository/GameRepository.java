package com.rentgame.repository;

import com.rentgame.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
}


package com.example.eliteFootballAcademy.data.repository;

import com.example.eliteFootballAcademy.data.models.Player;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long> {
}

package com.example.eliteFootballAcademy.data.repository;

import com.example.eliteFootballAcademy.data.models.Match;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {
}

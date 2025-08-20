package com.example.eliteFootballAcademy.data.repository;

import com.example.eliteFootballAcademy.data.models.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
}


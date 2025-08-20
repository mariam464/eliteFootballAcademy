package com.example.eliteFootballAcademy.data.repository;

import com.example.eliteFootballAcademy.data.models.Coach;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoachRepository extends JpaRepository<Coach, Long> {
}

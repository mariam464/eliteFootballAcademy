package com.example.eliteFootballAcademy.data.repository;

import com.example.eliteFootballAcademy.data.models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}

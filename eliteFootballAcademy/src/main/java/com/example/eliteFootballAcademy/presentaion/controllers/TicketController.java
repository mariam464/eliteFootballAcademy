package com.example.eliteFootballAcademy.presentaion.controllers;

import com.example.eliteFootballAcademy.business.services.TicketService;
import com.example.eliteFootballAcademy.presentaion.dtos.TicketDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<List<TicketDto>> getAll() {
        List<TicketDto> tickets = ticketService.getAll();
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> getById(@PathVariable Long id) {
        TicketDto ticket = ticketService.getById(id);
        return ResponseEntity.ok(ticket);
    }

    @PostMapping("/add")
    public ResponseEntity<TicketDto> create(@RequestBody TicketDto ticketDto) {
        TicketDto createdTicket = ticketService.create(ticketDto);
        return ResponseEntity.ok(createdTicket);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ticketService.delete(id);
        return ResponseEntity.noContent().build();
    }

}

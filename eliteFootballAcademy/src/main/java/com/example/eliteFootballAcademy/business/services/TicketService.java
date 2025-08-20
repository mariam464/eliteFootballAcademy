package com.example.eliteFootballAcademy.business.services;

import com.example.eliteFootballAcademy.presentaion.dtos.TicketDto;

import java.util.List;

public interface TicketService {
    List<TicketDto> getAll();
    TicketDto getById(Long id);
    TicketDto create(TicketDto ticketDto);
    void delete(Long id);
}

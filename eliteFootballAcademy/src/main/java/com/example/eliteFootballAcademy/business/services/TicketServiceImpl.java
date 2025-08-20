package com.example.eliteFootballAcademy.business.services;

import com.example.eliteFootballAcademy.business.exception.ResourceNotFoundException;
import com.example.eliteFootballAcademy.data.models.Match;
import com.example.eliteFootballAcademy.data.models.Ticket;
import com.example.eliteFootballAcademy.data.repository.MatchRepository;
import com.example.eliteFootballAcademy.data.repository.TicketRepository;
import com.example.eliteFootballAcademy.presentaion.dtos.TicketDto;
import com.example.eliteFootballAcademy.presentaion.mappers.TicketMapper;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final MatchRepository matchRepository;
    private final TicketMapper ticketMapper;

    public TicketServiceImpl(TicketRepository ticketRepository, MatchRepository matchRepository, TicketMapper ticketMapper) {
        this.ticketRepository = ticketRepository;
        this.matchRepository = matchRepository;
        this.ticketMapper = ticketMapper;
    }

    @Override
    public List<TicketDto> getAll() {
        return ticketRepository.findAll()
                .stream()
                .map(ticketMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TicketDto getById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        return ticketMapper.toDto(ticket);
    }

    @Override
    public TicketDto create(TicketDto ticketDto) {
        Match match = matchRepository.findById(ticketDto.getMatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));

        if (!match.isUpcoming()) {
            throw new ResourceNotFoundException("You can only reserve tickets for upcoming matches.");
        }

        Ticket ticket = ticketMapper.toEntity(ticketDto);
        ticket.setReservingDate(LocalDateTime.now());
        ticket.setMatch(match);
        Ticket savedTicket = ticketRepository.save(ticket);

        match.getTickets().add(ticket);
        return ticketMapper.toDto(savedTicket);
    }

    @Override
    public void delete(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ticket not found with id: " + id);
        }
        ticketRepository.deleteById(id);
    }

}


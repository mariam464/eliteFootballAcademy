package com.example.eliteFootballAcademy.presentaion.mappers;


import com.example.eliteFootballAcademy.data.models.Ticket;
import com.example.eliteFootballAcademy.presentaion.dtos.TicketDto;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {


    public TicketDto toDto(Ticket ticket) {
       if(ticket == null) return null;

       TicketDto dto = new TicketDto();
       dto.setId(ticket.getId());
       dto.setType(ticket.getType());
       dto.setCustomerName(ticket.getCustomerName());
       dto.setReservingDate(ticket.getReservingDate());
       dto.setMatchId(ticket.getMatch() != null ? ticket.getMatch().getId() : null);
       return dto;
    }

    public Ticket toEntity(TicketDto dto) {
        if(dto == null) return null;

        Ticket ticket = new Ticket();
        ticket.setId(dto.getId());
        ticket.setType(dto.getType());
        ticket.setCustomerName(dto.getCustomerName());
        return ticket;
    }
}


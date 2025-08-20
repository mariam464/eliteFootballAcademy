package com.example.eliteFootballAcademy.presentaion.dtos;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class TicketDto {
    private Long id;
    private String customerName;
    private String type;
    private Long matchId;
    private LocalDateTime reservingDate;
}

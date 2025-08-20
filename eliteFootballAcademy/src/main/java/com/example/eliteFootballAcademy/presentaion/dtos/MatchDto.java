package com.example.eliteFootballAcademy.presentaion.dtos;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class MatchDto {

    private Long id;
    private LocalDateTime date;
    private String location;
    private Long homeTeamId;
    private String awayTeamName;
    private Integer home_team_score;
    private Integer away_team_score;
    private boolean isUpcoming;
    public void computeIsUpcoming() {
        this.isUpcoming = date.isAfter(LocalDateTime.now());
    }
}
package com.example.eliteFootballAcademy.presentaion.mappers;

import com.example.eliteFootballAcademy.data.models.Match;
import com.example.eliteFootballAcademy.presentaion.dtos.MatchDto;
import java.time.LocalDateTime;

public class MatchMapper {

    public static MatchDto toDto(Match match) {
        if(match == null) return null;

        MatchDto dto = new MatchDto();
        dto.setId(match.getId());
        dto.setDate(match.getDate());
        dto.setLocation(match.getLocation());
        dto.setHomeTeamId(match.getHomeTeam() != null ? match.getHomeTeam().getId() : null);
        dto.setAwayTeamName(match.getAwayTeam() != null ? match.getAwayTeam() : null);
        dto.setHome_team_score(match.getHome_team_score());
        dto.setAway_team_score(match.getAway_team_score());
        dto.setUpcoming(match.getDate().isAfter(LocalDateTime.now()));
        return dto;
    }

    public static Match toEntity(MatchDto dto) {
        if(dto ==null) return null;

        Match match = new Match();
        match.setDate(dto.getDate());
        match.setLocation(dto.getLocation());
        match.setHome_team_score(dto.getHome_team_score());
        match.setAway_team_score(dto.getHome_team_score());
        match.setUpcoming(dto.isUpcoming());
        return match;
    }
}


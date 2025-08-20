package com.example.eliteFootballAcademy.presentaion.mappers;
import com.example.eliteFootballAcademy.data.models.Team;
import com.example.eliteFootballAcademy.presentaion.dtos.*;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class TeamMapper {

    public static TeamDto toDTO(Team team) {
        if (team == null) return null;

        TeamDto dto = new TeamDto();
        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setImageUrl(team.getImageUrl());

        if (team.getCoach() != null) {
            CoachDto coachDto = new CoachDto();
            coachDto.setId(team.getCoach().getId());
            coachDto.setName(team.getCoach().getName());
            coachDto.setAge(team.getCoach().getAge());
            coachDto.setImageUrl(team.getCoach().getImageUrl());
            dto.setCoach(coachDto);
        }

        if (team.getPlayers() != null) {
            List<PlayerDto> playerDtos = team.getPlayers().stream().map(player -> {
                PlayerDto p = new PlayerDto();
                p.setId(player.getId());
                p.setName(player.getName());
                p.setAge(player.getAge());
                p.setRole(player.getRole());
                p.setImageUrl(player.getImageUrl());
                return p;
            }).toList();
            dto.setPlayers(playerDtos);
        }

        if (team.getHomeMatches() != null) {
            Set<MatchDto> matchDtos = team.getHomeMatches().stream().map(match -> {
                MatchDto m = new MatchDto();
                m.setId(match.getId());
                m.setAwayTeamName(match.getAwayTeam());
                m.setDate(match.getDate());
                return m;
            }).collect(Collectors.toSet());
            dto.setHomeMatches(matchDtos);
        }

        return dto;
    }

    public static Team toEntity(CreateTeamDto dto) {
        if(dto == null) return null;

        Team team = new Team();
        team.setName(dto.getName());
        team.setImageUrl(dto.getImageUrl());
        return team;
    }
}

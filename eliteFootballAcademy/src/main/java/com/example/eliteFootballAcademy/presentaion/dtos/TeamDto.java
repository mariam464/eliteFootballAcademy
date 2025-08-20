package com.example.eliteFootballAcademy.presentaion.dtos;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class TeamDto {
    private Long id;
    private String name;
    private CoachDto coach;
    private List<PlayerDto> players;
    private Set<MatchDto> homeMatches;
    private String imageUrl;
}

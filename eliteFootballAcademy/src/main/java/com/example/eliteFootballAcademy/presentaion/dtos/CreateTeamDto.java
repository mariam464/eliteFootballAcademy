package com.example.eliteFootballAcademy.presentaion.dtos;

import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
public class CreateTeamDto {
    private String name;
    private Long coachId;
    private String imageUrl;
    private Set<Long> playersIds;
}

package com.example.eliteFootballAcademy.presentaion.mappers;

import com.example.eliteFootballAcademy.data.models.Coach;
import com.example.eliteFootballAcademy.presentaion.dtos.CoachDto;

public class CoachMapper {
    public static CoachDto toDTO(Coach coach) {
        if(coach == null) return null;

        CoachDto dto = new CoachDto();
        dto.setId(coach.getId());
        dto.setName(coach.getName());
        dto.setAge(coach.getAge());
        dto.setTeamId(coach.getTeam() != null ? coach.getTeam().getId() : null);
        dto.setJoinDate(coach.getJoinDate());
        dto.setImageUrl(coach.getImageUrl());
        return dto;
    }

    public static Coach toEntity(CoachDto dto) {
        if (dto == null) return null;

        Coach coach = new Coach();
        coach.setName(dto.getName());
        coach.setAge(dto.getAge());
        coach.setJoinDate(dto.getJoinDate());
        coach.setImageUrl(dto.getImageUrl());
        return coach;
    }
}


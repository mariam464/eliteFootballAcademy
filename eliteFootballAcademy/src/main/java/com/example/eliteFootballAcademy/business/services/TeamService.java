package com.example.eliteFootballAcademy.business.services;

import com.example.eliteFootballAcademy.presentaion.dtos.CreateTeamDto;
import com.example.eliteFootballAcademy.presentaion.dtos.TeamDto;
import java.util.List;
import java.util.Map;

public interface TeamService {
    List<TeamDto> getAll();
    TeamDto getById(long id);
    TeamDto create(CreateTeamDto teamDto);
    TeamDto patch(long id, Map<String, Object> updates);
    void delete(long id);
}

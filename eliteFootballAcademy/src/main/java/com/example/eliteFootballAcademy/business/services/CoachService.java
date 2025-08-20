package com.example.eliteFootballAcademy.business.services;

import com.example.eliteFootballAcademy.presentaion.dtos.CoachDto;
import java.util.List;
import java.util.Map;

public interface CoachService {
    List<CoachDto> getAll();
    List<CoachDto> getCoachesNotAssignedToTeams();
    CoachDto getById(long id);
    CoachDto create(CoachDto coach);
    CoachDto update(long id, CoachDto coach);
    CoachDto patch(long id, Map<String, Object> updates);
    void delete(long id);
}

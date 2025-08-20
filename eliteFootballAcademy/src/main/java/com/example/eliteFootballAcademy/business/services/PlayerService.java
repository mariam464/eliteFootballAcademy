package com.example.eliteFootballAcademy.business.services;

import com.example.eliteFootballAcademy.presentaion.dtos.PlayerDto;
import java.util.List;

public interface PlayerService {
    List<PlayerDto> getAll();
    PlayerDto getById(long id);
    List<PlayerDto> getPlayersNotAssignedToTeams();
    PlayerDto create(PlayerDto playerDto);
    PlayerDto update(long id, PlayerDto playerDto);
    void delete(long id);
}

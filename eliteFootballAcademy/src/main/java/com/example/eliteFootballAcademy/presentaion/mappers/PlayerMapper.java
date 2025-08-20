package com.example.eliteFootballAcademy.presentaion.mappers;

import com.example.eliteFootballAcademy.data.models.Player;
import com.example.eliteFootballAcademy.presentaion.dtos.PlayerDto;

public class PlayerMapper {

    public static PlayerDto toDTO(Player player) {
        if (player == null) return null;

        PlayerDto dto = new PlayerDto();
        dto.setId(player.getId());
        dto.setName(player.getName());
        dto.setTeamId(player.getTeam() != null ? player.getTeam().getId() : null);
        dto.setRole(player.getRole());
        dto.setAge(player.getAge());
        dto.setMatchesPlayed(player.getMatchesPlayed());
        dto.setJoinDate(player.getJoinDate());
        dto.setImageUrl(player.getImageUrl());
        return dto;
    }

    public static Player toEntity(PlayerDto dto) {
        if (dto == null) return null;

        Player player = new Player();
        player.setName(dto.getName());
        player.setRole(dto.getRole());
        player.setAge(dto.getAge());
        player.setMatchesPlayed(dto.getMatchesPlayed() != null ? dto.getMatchesPlayed() : 0);
        player.setJoinDate(dto.getJoinDate());
        player.setImageUrl(dto.getImageUrl());
        return player;
    }
}




package com.example.eliteFootballAcademy.business.services;

import com.example.eliteFootballAcademy.business.exception.ResourceNotFoundException;
import com.example.eliteFootballAcademy.data.models.Player;
import com.example.eliteFootballAcademy.data.models.Team;
import com.example.eliteFootballAcademy.data.repository.PlayerRepository;
import com.example.eliteFootballAcademy.data.repository.TeamRepository;
import com.example.eliteFootballAcademy.presentaion.dtos.PlayerDto;
import com.example.eliteFootballAcademy.presentaion.mappers.PlayerMapper;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerServiceImpl implements PlayerService{

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    public PlayerServiceImpl(PlayerRepository playerRepository, TeamRepository teamRepository) {
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
    }

    @Override
    public List<PlayerDto> getAll() {
        return playerRepository.findAll()
                .stream()
                .map(PlayerMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PlayerDto getById(long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + id));
        return PlayerMapper.toDTO(player);
    }
    @Override
    public List<PlayerDto> getPlayersNotAssignedToTeams(){
        return playerRepository.findAll()
                .stream()
                .filter(player -> player.getTeam() == null)
                .map(PlayerMapper::toDTO)
                .toList();
    }

    @Override
    public PlayerDto create(PlayerDto dto) {

        Player player = PlayerMapper.toEntity(dto);
        if (dto.getTeamId()==null) {
            player.setTeam(null);

        } else {

            Team team = teamRepository.findById(dto.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + dto.getTeamId()));

            player.setTeam(team);
        }
        Player savedPlayer = playerRepository.save(player);
        return PlayerMapper.toDTO(savedPlayer);
    }

    @Override
    public PlayerDto update(long id, PlayerDto playerDto) {
        Player existing = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + id));

        existing.setName(playerDto.getName());
        existing.setRole(playerDto.getRole());
        existing.setAge(playerDto.getAge());
        existing.setMatchesPlayed(playerDto.getMatchesPlayed());
        existing.setJoinDate(playerDto.getJoinDate());
        existing.setImageUrl(playerDto.getImageUrl());

        if (playerDto.getTeamId() != null) {
            Team team = teamRepository.findById(playerDto.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + playerDto.getTeamId()));
            existing.setTeam(team);
        } else{
            existing.setTeam(null);
        }

        Player updated = playerRepository.save(existing);
        return PlayerMapper.toDTO(updated);
    }

    @Override
    public void delete(long id) {
        if (!playerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Player not found with id: " + id);
        }
        playerRepository.deleteById(id);
    }

}


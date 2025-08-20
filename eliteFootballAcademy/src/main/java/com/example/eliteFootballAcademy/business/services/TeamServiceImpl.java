package com.example.eliteFootballAcademy.business.services;

import com.example.eliteFootballAcademy.business.exception.ResourceNotFoundException;
import com.example.eliteFootballAcademy.data.models.Coach;
import com.example.eliteFootballAcademy.data.models.Match;
import com.example.eliteFootballAcademy.data.models.Player;
import com.example.eliteFootballAcademy.data.models.Team;
import com.example.eliteFootballAcademy.data.repository.CoachRepository;
import com.example.eliteFootballAcademy.data.repository.MatchRepository;
import com.example.eliteFootballAcademy.data.repository.PlayerRepository;
import com.example.eliteFootballAcademy.data.repository.TeamRepository;
import com.example.eliteFootballAcademy.presentaion.dtos.CreateTeamDto;
import com.example.eliteFootballAcademy.presentaion.dtos.TeamDto;
import com.example.eliteFootballAcademy.presentaion.mappers.TeamMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final CoachRepository coachRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepo;

    public TeamServiceImpl(TeamRepository teamRepository,
                           CoachRepository coachRepository,
                           MatchRepository matchRepository, PlayerRepository playerRepo) {
        this.teamRepository = teamRepository;
        this.coachRepository = coachRepository;
        this.matchRepository = matchRepository;
        this.playerRepo = playerRepo;
    }

    @Override
    public List<TeamDto> getAll() {
        return teamRepository.findAll().stream()
                .map(TeamMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TeamDto getById(long id) {
        return teamRepository.findById(id)
                .map(TeamMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));
    }

    @Override
    public TeamDto create(CreateTeamDto dto) {
        Team team = TeamMapper.toEntity(dto);

        Set<Player> players = new HashSet<>();
        if (dto.getPlayersIds() != null && !dto.getPlayersIds().isEmpty())
        {
            List<Player> fetchedPlayers = playerRepo.findAllById(dto.getPlayersIds());

            if (fetchedPlayers.size() != dto.getPlayersIds().size()) {
                Set<Long> foundIds = fetchedPlayers.stream().map(Player::getId).collect(Collectors.toSet());
                List<Long> missingIds = dto.getPlayersIds().stream()
                        .filter(id -> !foundIds.contains(id))
                        .toList();
                throw new ResourceNotFoundException("Players not found: " + missingIds);
            }


            for (Player player : fetchedPlayers) {
                player.setTeam(team);
                players.add(player);
            }
        }

        team.setPlayers(players);


        if (dto.getCoachId() > 0) {
            Coach coach = coachRepository.findById(dto.getCoachId())
                    .orElseThrow(() -> new ResourceNotFoundException("Coach not found: " + dto.getCoachId()));

            if (coach.getTeam() != null) {
                throw new ResourceNotFoundException("Coach is already assigned to a team: " + coach.getTeam().getName());
            }


            team.setCoach(coach);
            coach.setTeam(team);
        }

        Team savedTeam = teamRepository.save(team);
        return TeamMapper.toDTO(savedTeam);
    }

    @Override
    @Transactional
    public TeamDto patch(long id, Map<String, Object> updates) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));

        if (updates.containsKey("name")) {
            String name = (String) updates.get("name");
            if (name != null && !name.isBlank()) team.setName(name);
        }

        if (updates.containsKey("imageUrl")) {
            String imageUrl = (String) updates.get("imageUrl");
            team.setImageUrl((imageUrl != null && !imageUrl.isBlank()) ? imageUrl : null);
        }

        if (updates.containsKey("coachId")) {
            Long coachId = ((Number) updates.get("coachId")).longValue();

            if (coachId <= 0) {
                if (team.getCoach() != null) {
                    team.getCoach().setTeam(null);
                    team.setCoach(null);
                }
            } else {
                Coach coach = coachRepository.findById(coachId)
                        .orElseThrow(() -> new ResourceNotFoundException("Coach not found: " + coachId));

                if (coach.getTeam() != null && !coach.getTeam().getId().equals(team.getId())) {
                    throw new IllegalStateException("Coach is already assigned to another team: "+ team.getName());
                }

                if (team.getCoach() != null && !team.getCoach().getId().equals(coach.getId())) {
                    team.getCoach().setTeam(null);
                }

                team.setCoach(coach);
                coach.setTeam(team);
            }
        }

        if (updates.containsKey("playerIds")) {
            @SuppressWarnings("unchecked")
            List<Number> playerIds = (List<Number>) updates.get("playerIds");

            List<Player> newPlayers = playerRepo.findAllById(
                    playerIds.stream().map(Number::longValue).toList()
            );

            for (Player old : new ArrayList<>(team.getPlayers())) {
                if (!newPlayers.contains(old)) {
                    old.setTeam(null);
                    team.getPlayers().remove(old);
                }
            }

            for (Player p : newPlayers) {
                if (!team.getPlayers().contains(p)) {
                    if (p.getTeam() != null && !p.getTeam().getId().equals(team.getId())) {
                        throw new IllegalStateException("Player already in another team");
                    }
                    p.setTeam(team);
                    team.getPlayers().add(p);
                }
            }
        }


        return TeamMapper.toDTO(teamRepository.save(team));
    }

    @Override
    public void delete(long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));

        if (team.getCoach() != null) {
            team.getCoach().setTeam(null);
            team.setCoach(null);
        }

        if (team.getPlayers() != null) {
            for (Player player : team.getPlayers()) {
                player.setTeam(null);
            }
            team.setPlayers(null);
        }


        teamRepository.delete(team);
    }

}


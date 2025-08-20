package com.example.eliteFootballAcademy.business.services;

import com.example.eliteFootballAcademy.business.exception.ResourceNotFoundException;
import com.example.eliteFootballAcademy.data.models.Coach;
import com.example.eliteFootballAcademy.data.models.Team;
import com.example.eliteFootballAcademy.data.repository.CoachRepository;
import com.example.eliteFootballAcademy.data.repository.TeamRepository;
import com.example.eliteFootballAcademy.presentaion.dtos.CoachDto;
import java.util.List;
import java.util.Map;
import com.example.eliteFootballAcademy.presentaion.mappers.CoachMapper;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.stream.Collectors;

@Service
public class CoachServiceImpl implements CoachService {

    private final CoachRepository coachRepo;
    private final TeamRepository teamRepository;
    public CoachServiceImpl(CoachRepository coachRepo, TeamRepository teamRepository) {
        this.coachRepo = coachRepo;
        this.teamRepository = teamRepository;
    }

    @Override
    public List<CoachDto> getAll() {
        return coachRepo.findAll()
                .stream()
                .map(CoachMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CoachDto getById(long id) {
        Coach coach = coachRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + id));
        return CoachMapper.toDTO(coach);
    }

    @Query("SELECT c FROM Coach c WHERE c.team IS NULL")
    @Override
    public List<CoachDto> getCoachesNotAssignedToTeams() {
        return coachRepo.findAll()
                .stream()
                .filter(coach -> coach.getTeam() == null)
                .map(CoachMapper::toDTO)
                .toList();
    }

    @Override
    public CoachDto create(CoachDto dto) {
        Coach coach = CoachMapper.toEntity(dto);
        if (dto.getTeamId()== null) {
            coach.setTeam(null);
        } else {
            Team team = teamRepository.findById(dto.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found"));
            if (team.getCoach() != null) {
                throw new ResourceNotFoundException("Coach is already assigned to a team: "+ team.getName());
            } else {
                coach.setTeam(team);
            }

        }
        Coach savedCoach = coachRepo.save(coach);
        return CoachMapper.toDTO(savedCoach);
    }

    @Override
    public CoachDto update(long id, CoachDto updatedCoachDto) {

        Coach existing = coachRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + id));
        existing.setName(updatedCoachDto.getName());
        existing.setAge(updatedCoachDto.getAge());
        existing.setJoinDate(updatedCoachDto.getJoinDate());
        existing.setImageUrl(updatedCoachDto.getImageUrl());
        if(updatedCoachDto.getTeamId() == null){
            existing.setTeam(null);
        }
        else
        {
            Team team = teamRepository.findById(updatedCoachDto.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + updatedCoachDto.getTeamId()));
            Coach currentCoach = team.getCoach();

            if (currentCoach != null && !currentCoach.getId().equals(updatedCoachDto.getId())) {
                throw new IllegalArgumentException(
                        "Team '" + team.getName() + "' already has a coach: " + currentCoach.getName()
                );

            }
            existing.setTeam(team);
        }

        Coach updated = coachRepo.save(existing);
        return CoachMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public CoachDto patch(long id, Map<String, Object> updates) {
        Coach coach = coachRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found"));

        if (updates.containsKey("name")) {
            coach.setName((String) updates.get("name"));
        }
        if (updates.containsKey("age")) {
            coach.setAge((Integer) updates.get("age"));
        }
        if (updates.containsKey("joinDate")) {
            coach.setJoinDate(LocalDate.parse((String) updates.get("joinDate")));
        }
        if (updates.containsKey("teamId")) {
            long teamId = (long) updates.get("teamId");

            Team newTeam = teamRepository.findById(teamId)
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

            Coach currentCoach = newTeam.getCoach();

            if (currentCoach != null && !currentCoach.getId().equals(coach.getId())) {
                throw new ResourceNotFoundException(
                        "Team '" + newTeam.getName() + "' already has a coach: " + currentCoach.getName()
                );
            }
            coach.setTeam(newTeam);
            newTeam.setCoach(coach);
        }

        return CoachMapper.toDTO(coach);
    }

    @Override
    public void delete(long id) {
        if (!coachRepo.existsById(id)) {
            throw new ResourceNotFoundException("coach not found with id: " + id);
        }
        coachRepo.deleteById(id);
    }
}


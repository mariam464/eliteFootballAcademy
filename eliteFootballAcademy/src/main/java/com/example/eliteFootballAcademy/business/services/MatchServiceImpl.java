package com.example.eliteFootballAcademy.business.services;

import com.example.eliteFootballAcademy.business.exception.ResourceNotFoundException;
import com.example.eliteFootballAcademy.data.models.Match;
import com.example.eliteFootballAcademy.data.models.Team;
import com.example.eliteFootballAcademy.data.repository.MatchRepository;
import com.example.eliteFootballAcademy.data.repository.TeamRepository;
import com.example.eliteFootballAcademy.presentaion.dtos.MatchDto;
import com.example.eliteFootballAcademy.presentaion.mappers.MatchMapper;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;

    public MatchServiceImpl(MatchRepository matchRepository, TeamRepository teamRepository) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
    }

    @Override
    public List<MatchDto> getAll() {
        return matchRepository.findAll()
                .stream()
                .map(MatchMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MatchDto getById(long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + id));
        return MatchMapper.toDto(match);
    }

    @Override
    public MatchDto create(MatchDto matchDto) {
        Team homeTeam = teamRepository.findById(matchDto.getHomeTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Home team not found"));
        matchDto.computeIsUpcoming();
        Match match = MatchMapper.toEntity(matchDto);
        match.setHomeTeam(homeTeam);
        match.setAwayTeam(matchDto.getAwayTeamName());
        homeTeam.getHomeMatches().add(match);
        Match savedMatch = matchRepository.save(match);

        return MatchMapper.toDto(savedMatch);
    }

    @Override
    public MatchDto update(long id, MatchDto updatedMatchDto) {
        updatedMatchDto.computeIsUpcoming();
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + id));


        match.setDate(updatedMatchDto.getDate());
        match.setLocation(updatedMatchDto.getLocation());
        match.setHome_team_score(updatedMatchDto.getHome_team_score());
        match.setAway_team_score(updatedMatchDto.getAway_team_score());


        Team homeTeam = teamRepository.findById(updatedMatchDto.getHomeTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Home team not found"));


        match.setHomeTeam(homeTeam);
        match.setAwayTeam(updatedMatchDto.getAwayTeamName());
        homeTeam.getHomeMatches().add(match);


        Match updatedMatch = matchRepository.save(match);
        return MatchMapper.toDto(updatedMatch);
    }

    @Override
    public void delete(long id) {
        if (!matchRepository.existsById(id)) {
            throw new ResourceNotFoundException("Match not found with id: " + id);
        }
        matchRepository.deleteById(id);
    }
}


package com.example.eliteFootballAcademy.presentaion.controllers;


import com.example.eliteFootballAcademy.business.services.TeamService;
import com.example.eliteFootballAcademy.presentaion.dtos.CreateTeamDto;
import com.example.eliteFootballAcademy.presentaion.dtos.TeamDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/teams")
public class TeamController {

    private final TeamService teamService;
    public TeamController(TeamService teamService) { this.teamService = teamService; }

    @GetMapping
    public ResponseEntity<List<TeamDto>> getAll() {
        return ResponseEntity.ok(teamService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getById(id));
    }

    @PostMapping("/add")
    public ResponseEntity<TeamDto> create(@RequestBody CreateTeamDto teamDto) {
        return ResponseEntity.ok(teamService.create(teamDto));
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<TeamDto> patchTeam(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        TeamDto updated = teamService.patch(id, updates);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teamService.delete(id);
        return ResponseEntity.noContent().build();
    }

}

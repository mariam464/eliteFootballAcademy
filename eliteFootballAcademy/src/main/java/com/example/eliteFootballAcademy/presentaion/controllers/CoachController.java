package com.example.eliteFootballAcademy.presentaion.controllers;

import com.example.eliteFootballAcademy.business.services.CoachService;
import com.example.eliteFootballAcademy.presentaion.dtos.CoachDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/coaches")
public class CoachController {
    private final CoachService coachService;

    public CoachController(CoachService coachService) {
        this.coachService = coachService;
    }

    @GetMapping
    public ResponseEntity<List<CoachDto>> getAll() {
        return ResponseEntity.ok(coachService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoachDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(coachService.getById(id));
    }

    @GetMapping("/free")
    public ResponseEntity<List<CoachDto>> getFree() {
        return ResponseEntity.ok(coachService.getCoachesNotAssignedToTeams());
    }

    @PostMapping("/add")
    public ResponseEntity<CoachDto> create(@RequestBody CoachDto coachDto) {
        return ResponseEntity.ok(coachService.create(coachDto));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CoachDto> update(@PathVariable Long id, @RequestBody CoachDto updatedCoach) {
        return ResponseEntity.ok(coachService.update(id, updatedCoach ));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        coachService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CoachDto> patchCoach(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        CoachDto updated = coachService.patch(id, updates);
        return ResponseEntity.ok(updated);
    }
}

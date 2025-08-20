package com.example.eliteFootballAcademy.presentaion.controllers;

import com.example.eliteFootballAcademy.business.services.MatchService;
import com.example.eliteFootballAcademy.presentaion.dtos.MatchDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping
    public ResponseEntity<List<MatchDto>> getAll() {
        List<MatchDto> matches = matchService.getAll();
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchDto> getById(@PathVariable long id) {
        MatchDto match = matchService.getById(id);
        return ResponseEntity.ok(match);
    }

    @PostMapping("/add")
    public ResponseEntity<MatchDto> create(@RequestBody MatchDto matchDto) {
        MatchDto createdMatch = matchService.create(matchDto);

        return ResponseEntity.ok(createdMatch);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MatchDto> update(@PathVariable long id, @RequestBody MatchDto matchDto) {
        MatchDto updatedMatch = matchService.update(id, matchDto);
        return ResponseEntity.ok(updatedMatch);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        matchService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

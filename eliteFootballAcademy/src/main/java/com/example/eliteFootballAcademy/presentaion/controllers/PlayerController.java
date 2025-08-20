package com.example.eliteFootballAcademy.presentaion.controllers;

import com.example.eliteFootballAcademy.business.services.PlayerService;
import com.example.eliteFootballAcademy.presentaion.dtos.PlayerDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }



    @GetMapping
    public ResponseEntity<List<PlayerDto>> getAll() {
        return ResponseEntity.ok(playerService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.getById(id));
    }
    @GetMapping("/free")
    public ResponseEntity<List<PlayerDto>> getFree() {
        return ResponseEntity.ok(playerService.getPlayersNotAssignedToTeams());
    }

    @PostMapping("/add")
    public ResponseEntity<PlayerDto> create(@RequestBody PlayerDto playerDto) {
        return ResponseEntity.ok(playerService.create(playerDto));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PlayerDto> update(@PathVariable Long id, @RequestBody PlayerDto updatedPlayer) {
        return ResponseEntity.ok(playerService.update(id, updatedPlayer ));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        playerService.delete(id);
        return ResponseEntity.noContent().build();
    }

}

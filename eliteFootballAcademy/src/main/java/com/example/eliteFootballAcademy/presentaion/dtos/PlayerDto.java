package com.example.eliteFootballAcademy.presentaion.dtos;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class PlayerDto {
    private Long id;
    private String name;
    private Long teamId;
    private String role;
    private Integer age;
    private Integer matchesPlayed;
    private LocalDate joinDate;
    private String imageUrl;
}

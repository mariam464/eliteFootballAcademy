package com.example.eliteFootballAcademy.presentaion.dtos;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class CoachDto {
    private Long id;
    private String name;
    private Integer age;
    private Long teamId;
    private LocalDate joinDate;
    private String imageUrl;
}

package com.example.eliteFootballAcademy.data.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "coaches")
public class Coach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private int age;
    private String imageUrl;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = true)
    @JsonBackReference
    private Team team;

    @Column(name = "join_date")
    private LocalDate joinDate;
}

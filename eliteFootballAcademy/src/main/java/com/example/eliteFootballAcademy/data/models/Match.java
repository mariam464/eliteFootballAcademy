package com.example.eliteFootballAcademy.data.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date;
    private String location;

    @ManyToOne
    @JoinColumn(name = "home_team_id")
    @JsonBackReference
    private Team homeTeam;

    private String awayTeam;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Ticket> tickets = new ArrayList<>();

    private int home_team_score;
    private int away_team_score;
    private boolean isUpcoming = false;
}
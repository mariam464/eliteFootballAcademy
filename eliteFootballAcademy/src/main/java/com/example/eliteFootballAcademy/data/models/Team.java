package com.example.eliteFootballAcademy.data.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "teams")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String imageUrl;

    @OneToOne(mappedBy = "team", fetch = FetchType.LAZY)
    @JsonBackReference
    private Coach coach;

    @OneToMany(mappedBy = "team", fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Player> players = new HashSet<>();

    @OneToMany(mappedBy = "homeTeam", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Match> homeMatches = new HashSet<>();
}
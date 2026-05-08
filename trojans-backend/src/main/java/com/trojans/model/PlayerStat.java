package com.trojans.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "player_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String position;

    @Column(nullable = false)
    private int appearances;

    @Column(nullable = false)
    private int tries;

    @Column(nullable = false)
    private int conversions;

    @Column(nullable = false)
    private int penalties;

    @Column(nullable = false)
    private int dropGoals;

    @Column(nullable = false)
    private int points;

    @Column(nullable = false)
    private int tackles;

    @Column(nullable = false)
    private int turnovers;

    @Column(nullable = false)
    private int manOfMatch;

    @Column(nullable = false)
    private int yellowCards;

    @Column(nullable = false)
    private int redCards;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

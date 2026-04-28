package com.trojans.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "matches")
@NoArgsConstructor
@AllArgsConstructor
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 50)
    private String date;
    
    @Column(length = 20)
    private String time;
    
    @Column(nullable = false, length = 100)
    private String opponent;
    
    @Column(length = 255)
    private String opponentLogo;
    
    @Column(length = 100)
    private String venue;
    
    @Column(length = 100)
    private String competition;
    
    @Column(length = 10)
    private String result;
    
    private Integer trojansScore;
    private Integer opponentScore;
    
    private Boolean isHome;
    
    @Column(length = 20)
    private String status;
    
    @Column(name = "player_ids", length = 500)
    private String playerIds;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

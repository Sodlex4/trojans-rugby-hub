package com.trojans.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, length = 50)
    private String position;
    
    @Column(length = 10)
    private String jerseyNumber;
    
    @Column(length = 255)
    private String imageUrl;
    
    @Column(length = 20)
    private String category;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Helper method to set category automatically
    @PrePersist
    @PreUpdate
    public void setCategory() {
        if (category == null || category.isEmpty()) {
            String[] forwards = {"Prop", "Hooker", "Lock", "Flanker", "Number 8"};
            String[] backs = {"Scrum-Half", "Fly-Half", "Centre", "Wing", "Full-Back"};
            
            for (String f : forwards) {
                if (f.equalsIgnoreCase(position)) {
                    this.category = "Forwards";
                    return;
                }
            }
            for (String b : backs) {
                if (b.equalsIgnoreCase(position)) {
                    this.category = "Backs";
                    return;
                }
            }
            this.category = "Staff";
        }
    }
}
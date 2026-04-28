package com.trojans.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinRequestDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String message;
    private String status;
    private LocalDateTime createdAt;
    
    public static JoinRequestDTO fromEntity(com.trojans.model.JoinRequest entity) {
        return new JoinRequestDTO(
            entity.getId(),
            entity.getName(),
            entity.getEmail(),
            entity.getPhone(),
            entity.getMessage(),
            entity.getStatus().name(),
            entity.getCreatedAt()
        );
    }
}
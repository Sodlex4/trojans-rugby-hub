package com.trojans.controller;

import com.trojans.dto.ApiResponse;
import com.trojans.dto.JoinRequestDTO;
import com.trojans.model.JoinRequest;
import com.trojans.repository.JoinRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/join-requests")
@RequiredArgsConstructor
public class JoinRequestController {
    
    private final JoinRequestRepository joinRequestRepository;
    
    @PostMapping
    public ResponseEntity<ApiResponse<JoinRequestDTO>> submitRequest(@RequestBody JoinRequestDTO dto) {
        try {
            JoinRequest request = new JoinRequest();
            request.setName(dto.getName());
            request.setEmail(dto.getEmail());
            request.setPhone(dto.getPhone());
            request.setMessage(dto.getMessage());
            request.setStatus(JoinRequest.RequestStatus.PENDING);
            
            JoinRequest saved = joinRequestRepository.save(request);
            return ResponseEntity.ok(ApiResponse.success(JoinRequestDTO.fromEntity(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<JoinRequestDTO>>> getAllRequests() {
        try {
            List<JoinRequestDTO> requests = joinRequestRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(JoinRequestDTO::fromEntity)
                .toList();
            return ResponseEntity.ok(ApiResponse.success(requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<JoinRequestDTO>>> getPendingRequests() {
        try {
            List<JoinRequestDTO> requests = joinRequestRepository
                .findByStatusOrderByCreatedAtDesc(JoinRequest.RequestStatus.PENDING)
                .stream()
                .map(JoinRequestDTO::fromEntity)
                .toList();
            return ResponseEntity.ok(ApiResponse.success(requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getPendingCount() {
        try {
            long count = joinRequestRepository.countByStatus(JoinRequest.RequestStatus.PENDING);
            return ResponseEntity.ok(ApiResponse.success(count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JoinRequestDTO>> acceptRequest(@PathVariable Long id) {
        try {
            JoinRequest request = joinRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
            request.setStatus(JoinRequest.RequestStatus.ACCEPTED);
            JoinRequest saved = joinRequestRepository.save(request);
            return ResponseEntity.ok(ApiResponse.success(JoinRequestDTO.fromEntity(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/decline")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JoinRequestDTO>> declineRequest(@PathVariable Long id) {
        try {
            JoinRequest request = joinRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
            request.setStatus(JoinRequest.RequestStatus.DECLINED);
            JoinRequest saved = joinRequestRepository.save(request);
            return ResponseEntity.ok(ApiResponse.success(JoinRequestDTO.fromEntity(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
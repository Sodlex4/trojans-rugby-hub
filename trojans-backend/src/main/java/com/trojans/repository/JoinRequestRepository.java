package com.trojans.repository;

import com.trojans.model.JoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    List<JoinRequest> findByStatusOrderByCreatedAtDesc(JoinRequest.RequestStatus status);
    List<JoinRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(JoinRequest.RequestStatus status);
}
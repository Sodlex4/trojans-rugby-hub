package com.trojans.repository;

import com.trojans.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByStatusOrderByDateAsc(String status);
    List<Match> findAllByOrderByDateAsc();
}

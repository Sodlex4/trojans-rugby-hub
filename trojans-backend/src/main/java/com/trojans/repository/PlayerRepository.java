package com.trojans.repository;

import com.trojans.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByCategory(String category);
    List<Player> findByPosition(String position);
    List<Player> findByNameContainingIgnoreCase(String name);
}
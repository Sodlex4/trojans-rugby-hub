package com.trojans.controller;

import com.trojans.dto.ApiResponse;
import com.trojans.model.PlayerStat;
import com.trojans.repository.PlayerStatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/player-stats")
@RequiredArgsConstructor
public class PlayerStatController {

    private final PlayerStatRepository playerStatRepository;

    @GetMapping
    public ResponseEntity<List<PlayerStat>> getAllStats() {
        return ResponseEntity.ok(playerStatRepository.findAllByOrderByPointsDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerStat> getStat(@PathVariable Long id) {
        return playerStatRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PlayerStat> createStat(@RequestBody PlayerStat stat) {
        return ResponseEntity.ok(playerStatRepository.save(stat));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerStat> updateStat(@PathVariable Long id, @RequestBody PlayerStat stat) {
        return playerStatRepository.findById(id)
                .map(existing -> {
                    stat.setId(id);
                    return ResponseEntity.ok(playerStatRepository.save(stat));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStat(@PathVariable Long id) {
        if (!playerStatRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        playerStatRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

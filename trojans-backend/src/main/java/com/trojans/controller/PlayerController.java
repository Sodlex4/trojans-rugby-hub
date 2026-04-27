package com.trojans.controller;

import com.trojans.dto.ApiResponse;
import com.trojans.model.Player;
import com.trojans.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {
    
    private final PlayerRepository playerRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Player>>> getAllPlayers() {
        List<Player> players = playerRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(players));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Player>> getPlayer(@PathVariable Long id) {
        return playerRepository.findById(id)
                .map(player -> ResponseEntity.ok(ApiResponse.success(player)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Player>>> getPlayersByCategory(@PathVariable String category) {
        List<Player> players = playerRepository.findByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(players));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Player>>> searchPlayers(@RequestParam String q) {
        List<Player> players = playerRepository.findByNameContainingIgnoreCase(q);
        return ResponseEntity.ok(ApiResponse.success(players));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Player>> createPlayer(@RequestBody Player player) {
        Player saved = playerRepository.save(player);
        return ResponseEntity.ok(ApiResponse.success("Player created", saved));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Player>> updatePlayer(@PathVariable Long id, @RequestBody Player player) {
        if (!playerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        player.setId(id);
        Player updated = playerRepository.save(player);
        return ResponseEntity.ok(ApiResponse.success("Player updated", updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deletePlayer(@PathVariable Long id) {
        if (!playerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        playerRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Player deleted", "done"));
    }
}
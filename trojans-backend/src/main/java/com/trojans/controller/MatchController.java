package com.trojans.controller;

import com.trojans.model.Match;
import com.trojans.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class MatchController {
    
    private final MatchRepository matchRepository;
    
    @GetMapping
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(matchRepository.findAllByOrderByDateAsc());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable Long id) {
        return matchRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Match>> getMatchesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(matchRepository.findByStatusOrderByDateAsc(status));
    }
    
    @PostMapping
    public ResponseEntity<Match> createMatch(@RequestBody Match match) {
        Match saved = matchRepository.save(match);
        log.info("Created match: {}", saved.getId());
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Match> updateMatch(@PathVariable Long id, @RequestBody Match matchDetails) {
        return matchRepository.findById(id)
            .map(match -> {
                match.setDate(matchDetails.getDate());
                match.setTime(matchDetails.getTime());
                match.setOpponent(matchDetails.getOpponent());
                match.setOpponentLogo(matchDetails.getOpponentLogo());
                match.setVenue(matchDetails.getVenue());
                match.setCompetition(matchDetails.getCompetition());
                match.setResult(matchDetails.getResult());
                match.setTrojansScore(matchDetails.getTrojansScore());
                match.setOpponentScore(matchDetails.getOpponentScore());
                match.setHome(matchDetails.getIsHome());
                match.setStatus(matchDetails.getStatus());
                match.setPlayerIds(matchDetails.getPlayerIds());
                return ResponseEntity.ok(matchRepository.save(match));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        return matchRepository.findById(id)
            .map(match -> {
                matchRepository.delete(match);
                log.info("Deleted match: {}", id);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}

package com.trojans.controller;

import com.trojans.dto.ApiResponse;
import com.trojans.model.Settings;
import com.trojans.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {
    
    private final SettingsRepository settingsRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Settings>>> getAllSettings() {
        List<Settings> settings = settingsRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(settings));
    }
    
    @GetMapping("/{key}")
    public ResponseEntity<ApiResponse<Settings>> getSetting(@PathVariable String key) {
        return settingsRepository.findBySettingKey(key)
                .map(s -> ResponseEntity.ok(ApiResponse.success(s)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Settings>> createOrUpdateSetting(@RequestBody Settings setting) {
        Settings saved = settingsRepository.save(setting);
        return ResponseEntity.ok(ApiResponse.success("Setting saved", saved));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSetting(@PathVariable Long id) {
        if (!settingsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        settingsRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Setting deleted", "done"));
    }
}
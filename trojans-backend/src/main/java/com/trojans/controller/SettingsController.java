package com.trojans.controller;

import com.trojans.dto.ApiResponse;
import com.trojans.model.Settings;
import com.trojans.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {
    
    private final SettingsRepository settingsRepository;
    
    @GetMapping
    public ResponseEntity<?> getAllSettings() {
        List<Settings> settings = settingsRepository.findAll();
        return ResponseEntity.ok(settings);
    }
    
    @GetMapping("/{key}")
    public ResponseEntity<Settings> getSetting(@PathVariable String key) {
        return settingsRepository.findBySettingKey(key)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Settings> createOrUpdateSetting(@RequestBody Settings setting) {
        Settings saved = settingsRepository.save(setting);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/batch")
    public ResponseEntity<?> batchSaveSettings(@RequestBody Map<String, String> settings) {
        settings.forEach((key, value) -> {
            Settings setting = settingsRepository.findBySettingKey(key)
                    .orElse(new Settings());
            setting.setSettingKey(key);
            setting.setSettingValue(value);
            settingsRepository.save(setting);
        });
        return ResponseEntity.ok(Map.of("success", true, "message", "Settings saved"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSetting(@PathVariable Long id) {
        if (!settingsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        settingsRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
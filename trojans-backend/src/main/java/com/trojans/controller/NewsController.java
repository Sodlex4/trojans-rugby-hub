package com.trojans.controller;

import com.trojans.dto.ApiResponse;
import com.trojans.model.News;
import com.trojans.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {
    
    private final NewsRepository newsRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<News>>> getAllNews() {
        List<News> news = newsRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(news));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<News>> getNews(@PathVariable Long id) {
        return newsRepository.findById(id)
                .map(n -> ResponseEntity.ok(ApiResponse.success(n)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<News>> createNews(@RequestBody News news) {
        News saved = newsRepository.save(news);
        return ResponseEntity.ok(ApiResponse.success("News created", saved));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<News>> updateNews(@PathVariable Long id, @RequestBody News news) {
        if (!newsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        news.setId(id);
        News updated = newsRepository.save(news);
        return ResponseEntity.ok(ApiResponse.success("News updated", updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNews(@PathVariable Long id) {
        if (!newsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        newsRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("News deleted", "done"));
    }
}
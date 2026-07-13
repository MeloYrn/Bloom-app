package com.bloom.education_service.controller;

import com.bloom.education_service.model.Article;
import com.bloom.education_service.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/education")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EducationController {

    private final ArticleRepository articleRepository;

    // GET /api/education/articles            -> all articles
    // GET /api/education/articles?category=X  -> filtered by category
    @GetMapping("/articles")
    public ResponseEntity<List<Article>> getArticles(
            @RequestParam(required = false) String category) {

        List<Article> articles = (category == null || category.isBlank())
            ? articleRepository.findAll()
            : articleRepository.findByCategoryIgnoreCase(category);

        return ResponseEntity.ok(articles);
    }

    // GET /api/education/articles/{id} -> single article (full content)
    @GetMapping("/articles/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable UUID id) {
        return articleRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET /api/education/categories -> distinct list of category names,
    // handy for the frontend to build a filter/tab bar
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = articleRepository.findAll().stream()
            .map(Article::getCategory)
            .distinct()
            .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    // POST /api/education/articles -> add a new article (curation/admin use)
    @PostMapping("/articles")
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        Article saved = articleRepository.save(article);
        return ResponseEntity.ok(saved);
    }

    // PUT /api/education/articles/{id} -> edit an existing article
    @PutMapping("/articles/{id}")
    public ResponseEntity<Article> updateArticle(
            @PathVariable UUID id, @RequestBody Article updated) {

        return articleRepository.findById(id)
            .map(existing -> {
                existing.setTitle(updated.getTitle());
                existing.setCategory(updated.getCategory());
                existing.setSummary(updated.getSummary());
                existing.setContent(updated.getContent());
                existing.setAuthor(updated.getAuthor());
                return ResponseEntity.ok(articleRepository.save(existing));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /api/education/articles/{id} -> remove an article
    @DeleteMapping("/articles/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable UUID id) {
        if (!articleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

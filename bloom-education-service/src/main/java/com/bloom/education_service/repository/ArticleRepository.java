package com.bloom.education_service.repository;

import com.bloom.education_service.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {
    List<Article> findByCategoryIgnoreCase(String category);
}

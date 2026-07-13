package com.bloom.education_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "articles")
@Data
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    // e.g. "Menstrual Health", "Reproductive Wellness", "Nutrition", "Discharge
    // Guide"
    @Column(nullable = false)
    private String category;

    // Short teaser shown in a list/card view before opening the full article
    @Column(length = 500)
    private String summary;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String author;

    private LocalDateTime publishedAt = LocalDateTime.now();
}

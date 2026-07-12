package com.bloom.community_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "community_posts")
@Data
public class CommunityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // ONLY pseudonym stored - never the real user ID.
    // This is what keeps the community truly anonymous.
    @Column(nullable = false)
    private String pseudonym;

    // e.g. "general", "cramps", "discharge", "mental-health", "contraceptives", "first-timers"
    @Column(nullable = false)
    private String channel;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private Integer upvotes = 0;

    private Boolean isFlagged = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}

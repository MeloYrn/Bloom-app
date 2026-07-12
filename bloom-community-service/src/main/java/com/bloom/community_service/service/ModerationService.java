package com.bloom.community_service.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

/**
 * Lightweight keyword-based moderation.
 * This is a basic first line of defense for the demo - it flags posts
 * containing banned/dangerous keywords for human review. It does NOT
 * delete or block posts automatically; isFlagged just surfaces them
 * to moderators.
 */
@Service
public class ModerationService {

    // Keep this short and demo-appropriate; extend as needed.
    private static final List<String> FLAGGED_KEYWORDS = List.of(
        "kill myself", "suicide", "self harm",
        "abortion pill", "overdose"
    );

    public boolean shouldFlag(String content) {
        if (content == null) return false;
        String lower = content.toLowerCase(Locale.ROOT);
        return FLAGGED_KEYWORDS.stream().anyMatch(lower::contains);
    }
}

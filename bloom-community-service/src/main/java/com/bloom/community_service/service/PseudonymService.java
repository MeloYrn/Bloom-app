package com.bloom.community_service.service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PseudonymService {

    private static final String[] COLORS = {
        "Purple", "Rose", "Coral", "Ivory", "Jade",
        "Amber", "Indigo", "Crimson", "Teal", "Silver"
    };

    private static final String[] FLOWERS = {
        "Orchid", "Lotus", "Dahlia", "Fern", "Lily",
        "Jasmine", "Violet", "Iris", "Poppy", "Zinnia"
    };

    private final Random random = new Random();

    public String generate() {
        String color = COLORS[random.nextInt(COLORS.length)];
        String flower = FLOWERS[random.nextInt(FLOWERS.length)];
        int number = random.nextInt(99) + 1;
        return color + flower + number; // e.g. PurpleOrchid42, TealLily7
    }
}

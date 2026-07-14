package com.bloom.Notification_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Sends push notifications via the Expo Push API.
 *
 * The frontend (services/notifications.ts) registers an Expo push token
 * with registerForPushNotifications(), NOT a raw Firebase token. Expo's
 * push endpoint needs no API key or service account setup, which makes
 * it the simplest option for a student project demo.
 *
 * Docs: https://docs.expo.dev/push-notifications/sending-notifications/
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    private final RestTemplate restTemplate;

    public void sendPeriodReminder(String expoPushToken, int daysUntil) {
        if (expoPushToken == null || expoPushToken.isBlank()) {
            System.out.println("Skipping reminder - no push token on file.");
            return;
        }

        String body = daysUntil == 0
            ? "Your period is expected today."
            : "Your period is expected in " + daysUntil + " day" + (daysUntil == 1 ? "" : "s") + ".";

        Map<String, Object> payload = new HashMap<>();
        payload.put("to", expoPushToken);
        payload.put("title", "🌸 Bloom Reminder");
        payload.put("body", body);
        payload.put("sound", "default");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            restTemplate.postForObject(EXPO_PUSH_URL, request, String.class);
            System.out.println("Sent reminder (" + daysUntil + " days) to token " + expoPushToken);
        } catch (Exception e) {
            // Don't let one failed push crash the whole scheduled job
            System.err.println("Failed to send push notification: " + e.getMessage());
        }
    }
}

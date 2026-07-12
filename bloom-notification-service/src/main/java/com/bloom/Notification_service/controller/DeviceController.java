package com.bloom.Notification_service.controller;

import com.bloom.Notification_service.dto.RegisterTokenRequest;
import com.bloom.Notification_service.model.FcmToken;
import com.bloom.Notification_service.repository.FcmTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DeviceController {

    private final FcmTokenRepository fcmTokenRepository;

    // Called by the app right after login, with the Expo push token
    @PostMapping("/register-token")
    public ResponseEntity<Void> registerToken(@RequestBody RegisterTokenRequest req) {
        UUID userId = UUID.fromString(req.getUserId());

        FcmToken fcmToken = fcmTokenRepository.findByUserId(userId)
            .orElse(new FcmToken());

        fcmToken.setUserId(userId);
        fcmToken.setToken(req.getToken());
        fcmToken.setUpdatedAt(LocalDateTime.now());

        fcmTokenRepository.save(fcmToken);
        return ResponseEntity.ok().build();
    }
}


package com.bloom.Notification_service.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendPeriodReminder(String fcmToken, int daysUntil) {
       
        System.out.println("Reminder placeholder: " + daysUntil + " days until period for token " + fcmToken);
    }
}

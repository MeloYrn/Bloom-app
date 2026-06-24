package com.bloom.Notification_service.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReminderScheduler {

    @Scheduled(cron = "0 0 9 * * *")
    public void checkReminders() {
        System.out.println("Running daily reminder check...");
    }
}

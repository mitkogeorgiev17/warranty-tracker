package com.mitko.warranty.tracker.notification.task;

import com.mitko.warranty.tracker.notification.EmailNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationScheduledTask {
    private final EmailNotificationService service;

    @Scheduled(cron = "0 41 18 * * *")
    public void sendNotificationsForExpiringWarranties() {
        var today = LocalDate.now();
        log.info("Checking for expired warranties... Date: {}", today);

        service.sendNotificationsForExpiringWarranties(today);
    }
}

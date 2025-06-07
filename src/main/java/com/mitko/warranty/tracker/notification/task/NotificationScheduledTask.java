package com.mitko.warranty.tracker.notification.task;

import com.mitko.warranty.tracker.notification.email.EmailNotificationService;
import com.mitko.warranty.tracker.notification.push.PushNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduledTask {
    private final EmailNotificationService emailNotificationService;
    private final PushNotificationService pushNotificationService;

    @Scheduled(cron = "0 30 16 * * *")
    public void sendNotificationsForExpiringWarranties() {
        var today = LocalDate.now();
        log.info("Checking for expired warranties... Date: {}", today);

        var usersWithExpiringWarranties = emailNotificationService.sendNotificationsForExpiringWarranties(today);

        pushNotificationService.sendNotificationForExpiringWarranties(usersWithExpiringWarranties);

        log.info("Sent push notifications to {} users with expiring warranties", usersWithExpiringWarranties.size());
    }
}

package com.mitko.warranty.tracker.warranty.task;

import com.mitko.warranty.tracker.warranty.WarrantyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class WarrantyExpirationScheduledTask {
    private final WarrantyService warrantyService;

    @Scheduled(cron = "30 0 0 * * *")
    public void updateExpiringWarranties() {
        var today = LocalDate.now();
        log.info("Checking for expired warranties... Date: {}", today);

        warrantyService.updateExpiringWarranties(today);
    }
}

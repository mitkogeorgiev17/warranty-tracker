package com.mitko.warranty.tracker.notification.push;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Push notifications token controller")
@RestController
@RequestMapping("/api/v1.0.0/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final PushNotificationService pushNotificationService;

    @PostMapping("/token")
    public void registerToken(
            @Valid @RequestBody TokenRegistrationRequest request,
            Authentication authentication) {

        String userId = getCurrentUserId(authentication);
        log.info("API call: registerToken for user: {}", userId);

        pushNotificationService.registerToken(userId, request);
    }

    @PostMapping("/send-test")
    public void sendTestNotification(Authentication authentication) {
        String userId = getCurrentUserId(authentication);
        log.info("API call: sendTestNotification for user: {}", userId);

        pushNotificationService.sendTestNotification(userId);
    }

    private String getCurrentUserId(Authentication authentication) {
        return authentication.getName();
    }
}
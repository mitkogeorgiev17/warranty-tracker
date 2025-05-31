package com.mitko.warranty.tracker.notification.push;

import com.google.firebase.messaging.*;
import com.mitko.warranty.tracker.exception.custom.NotificationException;
import com.mitko.warranty.tracker.warranty.model.Warranty;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class PushNotificationService {
    private final FirebaseMessaging firebaseMessaging;
    private final UserDeviceTokenRepository tokenRepository;

    public void registerToken(String userId, TokenRegistrationRequest request) {
        log.info("Registering token for user: {} with device type: {}", userId, request.getDeviceType());

        UserDeviceToken token = tokenRepository
                .findByUserIdAndDeviceToken(userId, request.getToken())
                .orElseGet(() -> createNewTokenRecord(userId, request));

        token.setLastUsed(LocalDateTime.now());
        token.setIsActive(true);
        token.setDeviceType(request.getDeviceType());
        token.setDeviceToken(request.getToken());
        tokenRepository.save(token);

        log.info("Updated existing token for user: {}", userId);
    }

    private UserDeviceToken createNewTokenRecord(String userId, TokenRegistrationRequest request) {
        return UserDeviceToken.builder()
                .userId(userId)
                .deviceToken(request.getToken())
                .deviceType(request.getDeviceType())
                .createdAt(LocalDateTime.now())
                .lastUsed(LocalDateTime.now())
                .isActive(true)
                .build();
    }

    private void sendNotificationToUser(String userId, String title, String body) {
        try {
            List<String> tokens = tokenRepository.findByUserIdAndIsActiveTrue(userId)
                    .stream()
                    .map(UserDeviceToken::getDeviceToken)
                    .toList();

            if (tokens.isEmpty()) {
                throw new NotificationException("No active tokens found");
            }

            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            List<Message> messages = new ArrayList<>();
            for (String token : tokens) {
                Message message = Message.builder()
                        .setToken(token)
                        .setNotification(notification)
                        .build();
                messages.add(message);
            }

            BatchResponse response = firebaseMessaging.sendEach(messages);

            log.info("Sent {} notifications successfully", response.getSuccessCount());

        } catch (FirebaseMessagingException e) {
            log.error("Firebase error sending notification", e);
            throw new NotificationException("Firebase error: " + e.getMessage());
        }
    }

    public void sendNotificationForExpiringWarranties(Map<String, Warranty> usersWithExpiringWarranties) {
        for (Map.Entry<String, Warranty> entry: usersWithExpiringWarranties.entrySet()) {
            sendNotificationToUser(
                    entry.getKey(),
                    "Warranty vault - Expiring warranty",
                    "Your warranty for " + entry.getValue().getName() + " is expiring in 1 month. Check out Warranty Vault for more information."
            );
        }
    }

    /**
     * @deprecated Test method
     * @param userId
     */
    public void sendTestNotification(String userId) {
        try {
            log.info("Sending test notification to user: {}", userId);

            // Check if user has any active tokens
            long activeTokenCount = tokenRepository.countByUserIdAndIsActiveTrue(userId);
            if (activeTokenCount == 0) {
                throw new NotificationException("No active device tokens found for user. Please register a device first.");
            }

            sendNotificationToUser(
                    userId,
                    "Test Notification",
                    "This is a test push notification from Warranty Vault!"
            );

            log.info("Test notification sent to {} device(s) for user: {}", activeTokenCount, userId);
        } catch (Exception e) {
            throw new NotificationException("Failed to send test notification: " + e.getMessage());
        }
    }
}
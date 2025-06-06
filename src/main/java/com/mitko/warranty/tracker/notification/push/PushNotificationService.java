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
import java.util.HashMap;
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

        log.info("Updated token for user: {} with device type: {}", userId, request.getDeviceType());
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

    private void sendNotificationToUser(String userId, String title, String body, Map<String, String> data) {
        try {
            List<UserDeviceToken> activeTokens = tokenRepository.findByUserIdAndIsActiveTrue(userId);

            if (activeTokens.isEmpty()) {
                log.warn("No active tokens found for user: {}", userId);
                throw new NotificationException("No active tokens found");
            }

            List<Message> messages = new ArrayList<>();

            for (UserDeviceToken tokenRecord : activeTokens) {
                String deviceType = tokenRecord.getDeviceType();
                String token = tokenRecord.getDeviceToken();

                log.info("Preparing notification for device type: {} with token: {}...",
                        deviceType, token.substring(0, Math.min(20, token.length())));

                Message.Builder messageBuilder = Message.builder().setToken(token);

                // Handle different device types
                if ("android".equals(deviceType) || "ios".equals(deviceType)) {
                    // Native mobile apps - use data payload and Android/iOS specific configs
                    Map<String, String> dataPayload = new HashMap<>();
                    if (data != null) {
                        dataPayload.putAll(data);
                    }
                    dataPayload.put("title", title);
                    dataPayload.put("body", body);

                    messageBuilder.putAllData(dataPayload);

                    if ("android".equals(deviceType)) {
                        // Android-specific configuration
                        AndroidConfig androidConfig = AndroidConfig.builder()
                                .setPriority(AndroidConfig.Priority.HIGH)
                                .setNotification(AndroidNotification.builder()
                                        .setTitle(title)
                                        .setBody(body)
                                        .setIcon("ic_push_icon")
                                        .setColor("#9797ff")
                                        .setChannelId("default_channel")
                                        .build())
                                .build();
                        messageBuilder.setAndroidConfig(androidConfig);
                    }
                } else {
                    // Web - use notification payload
                    Notification notification = Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build();

                    messageBuilder.setNotification(notification);

                    // Add data payload for web as well
                    if (data != null) {
                        messageBuilder.putAllData(data);
                    }

                    // Web-specific configuration
                    WebpushConfig webpushConfig = WebpushConfig.builder()
                            .setNotification(WebpushNotification.builder()
                                    .setTitle(title)
                                    .setBody(body)
                                    .setIcon("/favicon.png")
                                    .setTag("warranty-notification")
                                    .build())
                            .putData("click_action", "/")
                            .build();
                    messageBuilder.setWebpushConfig(webpushConfig);
                }

                messages.add(messageBuilder.build());
            }

            // Send all messages
            BatchResponse response = firebaseMessaging.sendEach(messages);

            log.info("Sent notifications to user {}: {} successful, {} failed",
                    userId, response.getSuccessCount(), response.getFailureCount());

            // Log any failures
            if (response.getFailureCount() > 0) {
                List<SendResponse> responses = response.getResponses();
                for (int i = 0; i < responses.size(); i++) {
                    SendResponse sendResponse = responses.get(i);
                    if (!sendResponse.isSuccessful()) {
                        UserDeviceToken failedToken = activeTokens.get(i);
                        log.error("Failed to send to device type {} with token {}...: {}",
                                failedToken.getDeviceType(),
                                failedToken.getDeviceToken().substring(0, Math.min(20, failedToken.getDeviceToken().length())),
                                sendResponse.getException().getMessage());

                        // Optionally mark token as inactive if it's invalid
                        if (sendResponse.getException() instanceof FirebaseMessagingException) {
                            FirebaseMessagingException fme = (FirebaseMessagingException) sendResponse.getException();
                            if (fme.getMessagingErrorCode() == MessagingErrorCode.UNREGISTERED ||
                                    fme.getMessagingErrorCode() == MessagingErrorCode.INVALID_ARGUMENT) {
                                failedToken.setIsActive(false);
                                tokenRepository.save(failedToken);
                                log.info("Marked invalid token as inactive for user: {}", userId);
                            }
                        }
                    }
                }
            }

        } catch (FirebaseMessagingException e) {
            log.error("Firebase error sending notification to user {}", userId, e);
            throw new NotificationException("Firebase error: " + e.getMessage());
        }
    }

    public void sendNotificationForExpiringWarranties(Map<String, Warranty> usersWithExpiringWarranties) {
        for (Map.Entry<String, Warranty> entry : usersWithExpiringWarranties.entrySet()) {
            Map<String, String> data = new HashMap<>();
            data.put("type", "warranty_expiring");
            data.put("warrantyId", String.valueOf(entry.getValue().getId()));
            data.put("action", "view_warranty");

            sendNotificationToUser(
                    entry.getKey(),
                    "Warranty Vault - Expiring Warranty",
                    "Your warranty for " + entry.getValue().getName() + " is expiring in 1 month. Check out Warranty Vault for more information.",
                    data
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
            List<UserDeviceToken> activeTokens = tokenRepository.findByUserIdAndIsActiveTrue(userId);
            if (activeTokens.isEmpty()) {
                throw new NotificationException("No active device tokens found for user. Please register a device first.");
            }

            // Log token information for debugging
            for (UserDeviceToken token : activeTokens) {
                log.info("Found active token for user {}: device type = {}, token = {}...",
                        userId, token.getDeviceType(),
                        token.getDeviceToken().substring(0, Math.min(20, token.getDeviceToken().length())));
            }

            Map<String, String> data = new HashMap<>();
            data.put("type", "test");
            data.put("action", "open_app");

            sendNotificationToUser(
                    userId,
                    "Warranty Vault - Test Notification",
                    "This is a test notification from Warranty Vault. Your notifications are working!",
                    data
            );

            log.info("Test notification sent to {} device(s) for user: {}", activeTokens.size(), userId);
        } catch (Exception e) {
            log.error("Failed to send test notification to user {}", userId, e);
            throw new NotificationException("Failed to send test notification: " + e.getMessage());
        }
    }

    // Overloaded method for backward compatibility
    private void sendNotificationToUser(String userId, String title, String body) {
        sendNotificationToUser(userId, title, body, null);
    }
}
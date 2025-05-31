package com.mitko.warranty.tracker.notification.push;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_device_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDeviceToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "device_token", nullable = false, unique = true, length = 500)
    private String deviceToken;

    @Column(name = "device_type")
    private String deviceType;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_used")
    private LocalDateTime lastUsed = LocalDateTime.now();

    @Column(name = "is_active")
    private Boolean isActive = true;
}

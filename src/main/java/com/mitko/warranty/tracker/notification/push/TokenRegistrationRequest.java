package com.mitko.warranty.tracker.notification.push;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenRegistrationRequest {
    @NotBlank(message = "Token cannot be blank")
    private String token;

    @NotBlank(message = "Device type cannot be blank")
    private String deviceType; // Possible values: web, android, ios
}
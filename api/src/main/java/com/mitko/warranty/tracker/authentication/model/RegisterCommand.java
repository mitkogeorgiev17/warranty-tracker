package com.mitko.warranty.tracker.authentication.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterCommand(
        @NotBlank(message = "Provide username.")
        String username,
        @NotBlank(message = "Provide password.")
        String password,
        @Email(message = "Invalid email.")
        @NotBlank(message = "Provide email.")
        String email
) {
}

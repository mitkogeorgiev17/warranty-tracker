package com.mitko.warranty.tracker.authentication.model;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationCommand (
        @NotBlank(message = "Provide authentication code.") String code
){
}

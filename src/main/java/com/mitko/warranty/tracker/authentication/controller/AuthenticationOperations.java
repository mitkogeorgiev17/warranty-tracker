package com.mitko.warranty.tracker.authentication.controller;

import com.mitko.warranty.tracker.authentication.model.AuthenticationCommand;
import com.mitko.warranty.tracker.authentication.model.AuthenticationResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Authentication operations", description = "Contains endpoints for authenticating and registering a new user with the help of Keycloak.")
public interface AuthenticationOperations {
    String getCodeUrl();

    AuthenticationResponse authenticate(@RequestBody AuthenticationCommand command);
}

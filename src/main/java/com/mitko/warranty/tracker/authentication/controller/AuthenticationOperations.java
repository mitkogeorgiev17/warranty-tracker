package com.mitko.warranty.tracker.authentication.controller;

import com.mitko.warranty.tracker.authentication.model.AuthenticationCommand;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Tag(name = "Authentication operations", description = "Contains endpoints for authenticating and registering a new user with the help of Keycloak.")
public interface AuthenticationOperations {
    @Operation(summary = "Receives authorization code URL for Keycloak.")
    @ApiResponse(responseCode = "200", description = "Code received.")
    String getCodeUrl();

    @ApiResponse(responseCode = "200", description = "Authentication successful, access token returned.")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication failed.", content = @Content(mediaType = "application/json"))
    @ApiResponse(responseCode = "500", description = "Internal server error.")
    Map<String, String> authenticate(@RequestBody AuthenticationCommand command);
}

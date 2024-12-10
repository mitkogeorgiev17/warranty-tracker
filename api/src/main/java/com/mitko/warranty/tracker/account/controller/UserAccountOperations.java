package com.mitko.warranty.tracker.account.controller;

import com.mitko.warranty.tracker.account.model.UserAccountResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;

@Tag(name = "User Account Operations")
public interface UserAccountOperations {
    @Operation(
            summary = "Get Logged-in User Information",
            description = "Returns account information for the currently authenticated user."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User account information retrieved successfully."),
            @ApiResponse(responseCode = "401", description = "Unauthorized - User is not authenticated."),
            @ApiResponse(responseCode = "500", description = "Internal server error.")
    })
    UserAccountResponse getLoggedUser(Authentication authentication);
}

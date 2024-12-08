package com.mitko.warranty.tracker.warranty.controller;

import com.mitko.warranty.tracker.warranty.model.request.CreateWarrantyCommand;
import com.mitko.warranty.tracker.warranty.model.response.WarrantyDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;

@Tag(name = "Warranty Operations", description = "Endpoints for creating and managing warranty records.")
public interface WarrantyOperations {
    @Operation(summary = "Create a new warranty", description = "Creates a new warranty and attaches it to the currently authenticated user. The warranty includes name, start date, end date, notes, and status.")
    @ApiResponse(responseCode = "201", description = "Warranty successfully created.")
    @ApiResponse(responseCode = "400", description = "Invalid request body (e.g., start date is after end date).")
    @ApiResponse(responseCode = "404", description = "User not found in the system.")
    @ApiResponse(responseCode = "500", description = "Unexpected server error.")
    WarrantyDTO createWarranty(@RequestBody CreateWarrantyCommand command, Authentication authentication);
}

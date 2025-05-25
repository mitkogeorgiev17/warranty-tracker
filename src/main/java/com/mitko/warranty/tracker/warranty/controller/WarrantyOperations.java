package com.mitko.warranty.tracker.warranty.controller;

import com.mitko.warranty.tracker.warranty.model.request.CreateWarrantyCommand;
import com.mitko.warranty.tracker.warranty.model.request.UpdateWarrantyCommand;
import com.mitko.warranty.tracker.warranty.model.response.AdvisorCommonQuestionsResponse;
import com.mitko.warranty.tracker.warranty.model.response.QuestionAnswerResponse;
import com.mitko.warranty.tracker.warranty.model.response.WarrantyDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Warranty Operations", description = "Endpoints for creating and managing warranty records.")
public interface WarrantyOperations {
    @Operation(summary = "Create a new warranty", description = "Creates a new warranty and attaches it to the currently authenticated user. The warranty includes name, start date, end date, notes, and status.")
    @ApiResponse(responseCode = "201", description = "Warranty successfully created.")
    @ApiResponse(responseCode = "400", description = "Invalid request body (e.g., start date is after end date).")
    @ApiResponse(responseCode = "404", description = "User not found in the system.")
    @ApiResponse(responseCode = "500", description = "Unexpected server error.")
    WarrantyDTO createWarranty(@RequestBody CreateWarrantyCommand command, Authentication authentication);

    @Operation(summary = "Receives all user's warranties.")
    @ApiResponse(responseCode = "200", description = "Warranties received")
    @ApiResponse(responseCode = "404", description = "User / Warranties not found.")
    List<WarrantyDTO> listUserWarranties(Authentication authentication);

    @Operation(summary = "Receives a warranty by ID.")
    @ApiResponse(responseCode = "200", description = "Warranty received")
    @ApiResponse(responseCode = "404", description = "Warranty not found.")
    WarrantyDTO getWarrantyById(@Parameter(name = "warrantyId", example = "1") long warrantyId, Authentication authentication);

    @Operation(summary = "Updates a warranty by ID.")
    @ApiResponse(responseCode = "202", description = "Warranty updated successfully.")
    @ApiResponse(responseCode = "400", description = "Invalid request (e.g., invalid date etc).")
    @ApiResponse(responseCode = "404", description = "Warranty not found.")
    @ApiResponse(responseCode = "500", description = "Unexpected server error.")
    WarrantyDTO updateWarranty(@RequestBody UpdateWarrantyCommand command, Authentication authentication);

    @Operation(summary = "Deletes a warranty by ID.")
    @ApiResponse(responseCode = "204", description = "Warranty deleted successfully.")
    @ApiResponse(responseCode = "404", description = "Warranty not found.")
    @ApiResponse(responseCode = "500", description = "Unexpected server error.")
    void deleteWarranty(@Parameter(name = "warrantyId", example = "1") long warrantyId, Authentication authentication);

    @Operation(summary = "Scan warranty file (picture / pdf) and returns its information.")
    @ApiResponse(responseCode = "200", description = "Warranty scanned successfully.")
    @ApiResponse(responseCode = "500", description = "Unexpected server error.")
    CreateWarrantyCommand scanWarranty(@RequestParam(name = "file") MultipartFile file);

    @Operation(summary = "Loads up 3 commons question about a warranty.")
    AdvisorCommonQuestionsResponse loadCommonQuestions(Authentication authentication, @Parameter(name = "warrantyId", example = "1") long warrantyId);

    @Operation(summary = "Answers a user question about a warranty.")
    QuestionAnswerResponse advisorAnswerQuestion(Authentication authentication, @Parameter(name = "warrantyId", example = "1") long warrantyId, String question);
}

package com.mitko.warranty.tracker.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    KEYCLOAK_AUTHORIZATION_ERROR("ERR001", "Authorization error."),
    USER_NOT_FOUND("ERR002", "User not found."),
    WARRANTY_NOT_FOUND("ERR003", "Warranty not found."),
    WARRANTY_BAD_REQUEST("ERR004", "Warranty bad request."),
    WARRANTY_FILE_NOT_FOUND("ERR005", "Warranty file not found."),
    OCR_FAILED("ERR006", "OCR failed to execute."),
    NOTIFICATION_ERROR("ERR007", "Notification error occurred.");

    private String value;
    private String message;

}

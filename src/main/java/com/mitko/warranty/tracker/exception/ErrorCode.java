package com.mitko.warranty.tracker.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    KEYCLOAK_AUTHORIZATION_ERROR("ERR001", "Authorization error."),
    USER_NOT_FOUND("ERR002", "User not found."),
    WARRANTY_NOT_FOUND("ERR003", "Warranty not found."),
    WARRANTY_BAD_REQUEST("ERR004", "Warranty bad request.");

    private String value;
    private String message;

}

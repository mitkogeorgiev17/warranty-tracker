package com.mitko.warranty.tracker.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    KEYCLOAK_AUTHORIZATION_ERROR("ERR001", "Authorization error.");

    private String value;
    private String message;

}

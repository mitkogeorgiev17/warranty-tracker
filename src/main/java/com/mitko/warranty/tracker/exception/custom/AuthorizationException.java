package com.mitko.warranty.tracker.exception.custom;

import com.mitko.warranty.tracker.exception.CustomResponseStatusException;

import static com.mitko.warranty.tracker.exception.ErrorCode.KEYCLOAK_AUTHORIZATION_ERROR;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

public class AuthorizationException extends CustomResponseStatusException {
    public AuthorizationException(String message) {
        super(UNAUTHORIZED, KEYCLOAK_AUTHORIZATION_ERROR.getValue(), KEYCLOAK_AUTHORIZATION_ERROR.getMessage(), message);
    }
}

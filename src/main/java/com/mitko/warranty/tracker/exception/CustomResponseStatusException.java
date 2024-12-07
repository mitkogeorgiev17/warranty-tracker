package com.mitko.warranty.tracker.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomResponseStatusException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String errorCode;
    private final String error;
    private final String message;

    public CustomResponseStatusException(HttpStatus httpStatus, String errorCode, String error, String message) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.error = error;
        this.message = message;
    }
}

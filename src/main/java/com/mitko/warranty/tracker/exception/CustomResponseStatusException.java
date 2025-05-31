package com.mitko.warranty.tracker.exception;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

@Getter
@Slf4j
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
        log.error(details());
    }

    public String details() {
        return "Error [" +
                "httpStatus=" + httpStatus +
                ", errorCode='" + errorCode + '\'' +
                ", error='" + error + '\'' +
                ", message='" + message + '\'' +
                ']';
    }
}

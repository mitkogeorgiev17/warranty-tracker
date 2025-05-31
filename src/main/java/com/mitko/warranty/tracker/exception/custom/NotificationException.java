package com.mitko.warranty.tracker.exception.custom;

import com.mitko.warranty.tracker.exception.CustomResponseStatusException;

import static com.mitko.warranty.tracker.exception.ErrorCode.NOTIFICATION_ERROR;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

public class NotificationException extends CustomResponseStatusException {
    public NotificationException(String message) {
        super(INTERNAL_SERVER_ERROR, NOTIFICATION_ERROR.getValue(), NOTIFICATION_ERROR.getMessage(), message);
    }
}

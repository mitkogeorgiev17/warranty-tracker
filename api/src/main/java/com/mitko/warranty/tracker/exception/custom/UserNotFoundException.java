package com.mitko.warranty.tracker.exception.custom;

import com.mitko.warranty.tracker.exception.CustomResponseStatusException;

import static com.mitko.warranty.tracker.exception.ErrorCode.USER_NOT_FOUND;
import static org.springframework.http.HttpStatus.NOT_FOUND;

public class UserNotFoundException extends CustomResponseStatusException {
    public UserNotFoundException(String id) {
        super(NOT_FOUND, USER_NOT_FOUND.getValue(), USER_NOT_FOUND.getMessage(), "User with ID " + id + " not found.");
    }
}

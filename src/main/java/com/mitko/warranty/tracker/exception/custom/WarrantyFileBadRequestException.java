package com.mitko.warranty.tracker.exception.custom;

import com.mitko.warranty.tracker.exception.CustomResponseStatusException;

import static com.mitko.warranty.tracker.exception.ErrorCode.WARRANTY_BAD_REQUEST;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

public class WarrantyFileBadRequestException extends CustomResponseStatusException {
    public WarrantyFileBadRequestException(String message) {
        super(BAD_REQUEST, WARRANTY_BAD_REQUEST.getValue(), WARRANTY_BAD_REQUEST.getMessage(), message);
    }
}

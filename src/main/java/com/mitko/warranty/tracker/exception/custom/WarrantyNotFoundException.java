package com.mitko.warranty.tracker.exception.custom;

import com.mitko.warranty.tracker.exception.CustomResponseStatusException;

import static com.mitko.warranty.tracker.exception.ErrorCode.WARRANTY_NOT_FOUND;
import static org.springframework.http.HttpStatus.NOT_FOUND;

public class WarrantyNotFoundException extends CustomResponseStatusException {
    public WarrantyNotFoundException(long warrantyId) {
        super(NOT_FOUND, WARRANTY_NOT_FOUND.getValue(), WARRANTY_NOT_FOUND.getMessage(), "Warranty with ID " + warrantyId + " not found.");
    }
}

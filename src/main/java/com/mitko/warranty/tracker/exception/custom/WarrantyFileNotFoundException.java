package com.mitko.warranty.tracker.exception.custom;

import com.mitko.warranty.tracker.exception.CustomResponseStatusException;

import static com.mitko.warranty.tracker.exception.ErrorCode.WARRANTY_FILE_NOT_FOUND;
import static org.springframework.http.HttpStatus.NOT_FOUND;

public class WarrantyFileNotFoundException extends CustomResponseStatusException {
    public WarrantyFileNotFoundException(String fileId) {
        super(NOT_FOUND, WARRANTY_FILE_NOT_FOUND.getValue(), WARRANTY_FILE_NOT_FOUND.getMessage(), "Warranty file with public ID " + fileId + " not found.");
    }
}

package com.mitko.warranty.tracker.exception.custom;

import com.mitko.warranty.tracker.exception.CustomResponseStatusException;
import org.springframework.http.HttpStatus;

import static com.mitko.warranty.tracker.exception.ErrorCode.OCR_FAILED;

public class OCRException extends CustomResponseStatusException {
    public OCRException(String message) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, OCR_FAILED.getValue(), OCR_FAILED.getMessage(), message);
    }
}

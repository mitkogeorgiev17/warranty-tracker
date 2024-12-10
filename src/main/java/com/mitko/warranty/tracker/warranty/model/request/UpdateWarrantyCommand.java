package com.mitko.warranty.tracker.warranty.model.request;

import com.mitko.warranty.tracker.warranty.model.WarrantyStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateWarrantyCommand(
        @Min(1)
        long warrantyId,
        @Size(min = 2, max = 64, message = "Name size must be between 2 and 64 symbols.")
        String name,
        LocalDate startDate,
        LocalDate endDate,
        WarrantyStatus status,
        @Size(min = 2, max = 2048, message = "Note size must be between 2 and 2048 symbols.")
        String note
) {
}

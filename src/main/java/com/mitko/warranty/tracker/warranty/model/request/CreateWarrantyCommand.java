package com.mitko.warranty.tracker.warranty.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateWarrantyCommand(
        @NotBlank(message = "Provide warranty name.")
        @Size(min = 2, max = 64, message = "Name length must be between 2 and 64.")
        String name,
        String note,
        @NotNull(message = "Provide start date.")
        LocalDate startDate,
        @NotNull(message = "Provide end date.")
        LocalDate endDate,
        @Size(min = 2, max = 64, message = "Category size should be between 2 and 64 symbols.")
        String category
) {
}

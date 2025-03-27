package com.mitko.warranty.tracker.file.model;

import java.time.LocalDate;

public record WarrantyFileDTO(
        long id,
        String filePath,
        String name,
        String contentType,
        long fileSize,
        LocalDate uploadDate
) {
}

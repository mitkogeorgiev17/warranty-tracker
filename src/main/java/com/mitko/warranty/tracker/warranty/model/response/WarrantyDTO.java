package com.mitko.warranty.tracker.warranty.model.response;

import com.mitko.warranty.tracker.warranty.model.WarrantyStatus;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Accessors(chain = true)
public class WarrantyDTO {
    private long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private WarrantyStatus status;
    private WarrantyMetadata metadata;

    @Data
    @Accessors(chain = true)
    public static class WarrantyMetadata {
        private String note;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}

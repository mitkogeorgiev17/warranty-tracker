package com.mitko.warranty.tracker.warranty.model.response;

import com.mitko.warranty.tracker.file.model.WarrantyFileDTO;
import com.mitko.warranty.tracker.warranty.model.WarrantyStatus;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Accessors(chain = true)
public class WarrantyDTO {
    private long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private WarrantyStatus status;
    private String category;
    private WarrantyMetadata metadata;
    private List<WarrantyFileDTO> files;

    @Data
    @Accessors(chain = true)
    public static class WarrantyMetadata {
        private String note;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}

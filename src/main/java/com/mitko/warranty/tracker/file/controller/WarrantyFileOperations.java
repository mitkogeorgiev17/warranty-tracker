package com.mitko.warranty.tracker.file.controller;

import com.mitko.warranty.tracker.file.model.WarrantyFileDTO;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "Warranty File Operations")
public interface WarrantyFileOperations {
    WarrantyFileDTO addFile(@Parameter(name = "warrantyId", example = "1") long warrantyId, MultipartFile file, Authentication authentication) throws IOException;
}

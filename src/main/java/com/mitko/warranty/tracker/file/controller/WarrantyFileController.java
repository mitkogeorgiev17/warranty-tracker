package com.mitko.warranty.tracker.file.controller;

import com.mitko.warranty.tracker.file.WarrantyFileService;
import com.mitko.warranty.tracker.file.model.WarrantyFileDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1.0.0/warranties/files")
@RequiredArgsConstructor
public class WarrantyFileController implements WarrantyFileOperations {
    private final WarrantyFileService service;

    @Override
    @PostMapping(value = "/{warrantyId}", consumes = { "multipart/form-data" })
    public WarrantyFileDTO addFile(@PathVariable("warrantyId") long warrantyId, @RequestParam("file") MultipartFile file, Authentication authentication) throws IOException {
        return service.addFile(warrantyId, file, authentication);
    }
}

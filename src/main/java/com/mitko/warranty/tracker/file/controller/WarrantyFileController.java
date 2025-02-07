package com.mitko.warranty.tracker.file.controller;

import com.mitko.warranty.tracker.file.WarrantyFileService;
import com.mitko.warranty.tracker.file.model.WarrantyFileDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1.0.0/warranties/files")
@RequiredArgsConstructor
public class WarrantyFileController implements WarrantyFileOperations {
    private final WarrantyFileService service;

    @PostMapping(value = "/{warrantyId}", consumes = { "multipart/form-data" })
    @ResponseStatus(HttpStatus.CREATED)
    public List<WarrantyFileDTO> addFiles(@PathVariable("warrantyId") long warrantyId, @RequestParam("file") List<MultipartFile> files, Authentication authentication) throws IOException {
        return service.addFiles(warrantyId, files, authentication);
    }
}

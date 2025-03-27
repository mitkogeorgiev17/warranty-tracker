package com.mitko.warranty.tracker.file.controller;

import com.mitko.warranty.tracker.file.WarrantyFileService;
import com.mitko.warranty.tracker.file.model.WarrantyFileDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

@RestController
@RequestMapping("/api/v1.0.0/warranties/files")
@RequiredArgsConstructor
public class WarrantyFileController implements WarrantyFileOperations {
    private final WarrantyFileService service;

    @PostMapping(value = "/{warrantyId}", consumes = { "multipart/form-data" })
    @ResponseStatus(CREATED)
    public List<WarrantyFileDTO> addFiles(@PathVariable("warrantyId") long warrantyId, @RequestParam("filePath") List<MultipartFile> files, Authentication authentication) throws IOException {
        return service.addFiles(warrantyId, files, authentication);
    }

    @DeleteMapping("/{warrantyId}")
    @ResponseStatus(NO_CONTENT)
    public void deleteFiles(@PathVariable("warrantyId") long warrantyId, @RequestParam List<Long> fileIDs, Authentication authentication) {
        service.deleteFilesByIds(warrantyId, fileIDs, authentication);
    }
}

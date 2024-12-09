package com.mitko.warranty.tracker.file;

import com.cloudinary.Cloudinary;
import com.mitko.warranty.tracker.exception.custom.WarrantyFileBadRequestException;
import com.mitko.warranty.tracker.exception.custom.WarrantyNotFoundException;
import com.mitko.warranty.tracker.file.model.WarrantyFile;
import com.mitko.warranty.tracker.file.model.WarrantyFileDTO;
import com.mitko.warranty.tracker.mapper.WarrantyFileMapper;
import com.mitko.warranty.tracker.warranty.WarrantyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class WarrantyFileService {
    private final Cloudinary cloudinary;
    private final WarrantyFileRepository repository;
    private final WarrantyRepository warrantyRepository;
    private final WarrantyFileMapper mapper;

    /**
     * Adds a file to  a warranty by ID. File is uploaded to Cloudinary and the URL is saved in the DB.
     * @param warrantyId ID of warranty we add the file to
     * @param file MultipartFile being uploaded
     * @param authentication
     * @return file mapped to a DTO
     * @see WarrantyFileDTO
     * // TODO Change file storage provider (or use newer version)
     */
    public WarrantyFileDTO addFile(long warrantyId, MultipartFile file, Authentication authentication) throws IOException {
        log.info("Adding a file to warranty with ID {}.", warrantyId);

        var warranty = warrantyRepository.findByIdAndUser_Id(warrantyId, authentication.getName())
                .orElseThrow(() -> new WarrantyNotFoundException(warrantyId));

        try {
            String fileUrl = uploadFile(file);

            var newFile = new WarrantyFile()
                    .setFile(fileUrl)
                    .setWarranty(warranty);

            var savedFile = repository.save(newFile);

            log.info("File added successfully.");

            return mapper.toDto(savedFile);
        } catch (IOException ex) {
            throw new WarrantyFileBadRequestException("Error occurred while uploading file. Message: " + ex.getMessage());
        }
    }

    private String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of());
        return uploadResult.get("url").toString();
    }
}

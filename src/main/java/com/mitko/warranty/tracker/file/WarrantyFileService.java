package com.mitko.warranty.tracker.file;

import com.cloudinary.Cloudinary;
import com.mitko.warranty.tracker.exception.custom.WarrantyFileBadRequestException;
import com.mitko.warranty.tracker.exception.custom.WarrantyFileNotFoundException;
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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.cloudinary.Cloudinary.emptyMap;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class WarrantyFileService {
    private static final String URL = "url";
    private static final String PUBLIC_ID = "public_id";
    private static final String ORIGINAL_FILENAME = "original_filename";
    private static final String BYTES = "bytes";
    private static final String RESOURCE_TYPE = "resource_type";
    private static final String FORMAT = "format";

    private final Cloudinary cloudinary;
    private final WarrantyFileRepository repository;
    private final WarrantyRepository warrantyRepository;
    private final WarrantyFileMapper mapper;

    /**
     * Adds a file to a warranty by ID. File is uploaded to Cloudinary and the URL and Public ID are saved in the DB.
     * Additional file metadata like name, content type, size, and upload date are also saved.
     *
     * @param warrantyId ID of warranty we add the file to
     * @param files List of files being uploaded
     * @param authentication authentication object containing user details
     * @return list of files mapped to DTOs
     * @throws IOException if an error occurs during file upload
     * @see WarrantyFileDTO
     */
    public List<WarrantyFileDTO> addFiles(long warrantyId, List<MultipartFile> files, Authentication authentication) throws IOException {
        log.info("Adding {} file(s) to warranty with ID {}.", files.size(), warrantyId);

        var warranty = warrantyRepository.findByIdAndUser_Id(warrantyId, authentication.getName())
                .orElseThrow(() -> new WarrantyNotFoundException(warrantyId));

        try {
            var newFiles = new ArrayList<WarrantyFile>();

            for (MultipartFile file : files) {
                Map<?, ?> uploadResult = uploadFile(file);

                // Extract file information from uploadResult and file object
                String url = uploadResult.get(URL).toString();
                String publicId = uploadResult.get(PUBLIC_ID).toString();
                String originalFilename = file.getOriginalFilename();
                String contentType = file.getContentType();
                long fileSize = file.getSize();

                WarrantyFile warrantyFile = new WarrantyFile()
                        .setWarranty(warranty)
                        .setFilePath(url)
                        .setFileId(publicId)
                        .setName(originalFilename)
                        .setContentType(contentType)
                        .setFileSize(fileSize)
                        .setUploadDate(LocalDate.now());

                newFiles.add(warrantyFile);
            }

            var savedFiles = repository.saveAll(newFiles);
            log.info("{} file(s) added successfully to warranty with ID {}.", savedFiles.size(), warrantyId);

            return mapper.toDto(savedFiles);
        } catch (IOException ex) {
            log.error("Error occurred while uploading file(s): {}", ex.getMessage());
            throw new WarrantyFileBadRequestException("Error occurred while uploading file(s). Message: " + ex.getMessage());
        }
    }

    /**
     * Deletes files by their IDs for a specific warranty
     *
     * @param warrantyId ID of the warranty
     * @param fileIds List of file IDs to delete
     * @param authentication authentication object containing user details
     */
    public void deleteFilesByIds(long warrantyId, List<Long> fileIds, Authentication authentication) {
        log.info("Removing {} file(s) for warranty with ID {}.", fileIds.size(), warrantyId);

        var files = repository.findAllByWarrantyIdAndIdIn(warrantyId, fileIds);

        if (files.isEmpty()) {
            log.warn("No files found for deletion with the provided IDs for warranty ID {}", warrantyId);
            return;
        }

        List<String> cloudinaryIds = files.stream()
                .map(WarrantyFile::getFileId)
                .toList();

        deleteAllFilesWithIdsIn(cloudinaryIds);
        repository.deleteAll(files);

        log.info("{} files removed successfully from warranty with ID {}.", files.size(), warrantyId);
    }

    /**
     * Uploads a single file to Cloudinary
     *
     * @param file The file to upload
     * @return Map containing the upload result
     * @throws IOException if an error occurs during upload
     */
    private Map<?, ?> uploadFile(MultipartFile file) throws IOException {
        // You can add additional upload options as needed
        Map<String, Object> options = Map.of(
                "resource_type", "auto"  // Automatically detect resource type
        );

        return cloudinary.uploader().upload(file.getBytes(), options);
    }

    /**
     * Uploads multiple files to Cloudinary
     *
     * @param files List of files to upload
     * @return List of Maps containing upload results
     * @throws IOException if an error occurs during upload
     */
    private List<Map<?, ?>> uploadFiles(List<MultipartFile> files) throws IOException {
        List<Map<?, ?>> uploadResults = new ArrayList<>();

        for (MultipartFile file : files) {
            uploadResults.add(uploadFile(file));
        }

        return uploadResults;
    }

    /**
     * Deletes a file from Cloudinary by its file ID
     *
     * @param fileId The Cloudinary public ID of the file
     * @return boolean indicating success
     */
    private boolean deleteByFileId(String fileId) {
        try {
            var result = cloudinary.uploader().destroy(fileId, emptyMap());
            return result.get("result").equals("ok");
        } catch (IOException e) {
            log.error("Failed to delete file with ID {}: {}", fileId, e.getMessage());
            throw new WarrantyFileNotFoundException(fileId);
        }
    }

    /**
     * Deletes multiple files from Cloudinary by their file IDs
     *
     * @param fileIds List of Cloudinary public IDs
     * @return boolean indicating success
     */
    public boolean deleteAllFilesWithIdsIn(List<String> fileIds) {
        boolean allSuccessful = true;

        for (String fileId : fileIds) {
            boolean success = deleteByFileId(fileId);
            if (!success) {
                allSuccessful = false;
                log.warn("Failed to delete file with ID {}", fileId);
            }
        }

        return allSuccessful;
    }
}
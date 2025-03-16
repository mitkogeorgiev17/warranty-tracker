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

    private final Cloudinary cloudinary;
    private final WarrantyFileRepository repository;
    private final WarrantyRepository warrantyRepository;
    private final WarrantyFileMapper mapper;

    /**
     * Adds a file to  a warranty by ID. File is uploaded to Cloudinary and the URL and Public ID are  saved in the DB.
     * @param warrantyId ID of warranty we add the filePath to
     * @param files List of files being uploaded
     * @param authentication
     * @return file mapped to a DTO
     * @see WarrantyFileDTO
     */
    public List<WarrantyFileDTO> addFiles(long warrantyId, List<MultipartFile> files, Authentication authentication) throws IOException {
        log.info("Adding a filePath to warranty with ID {}.", warrantyId);

        var warranty = warrantyRepository.findByIdAndUser_Id(warrantyId, authentication.getName())
                .orElseThrow(() -> new WarrantyNotFoundException(warrantyId));

        try {
            List<Map<String,String>> filesData = uploadFiles(files);

            var newFiles = new ArrayList<WarrantyFile>();

            for (var entry : filesData) {
                for (Map.Entry<String, String> item : entry.entrySet()) {
                    if (item.getKey().startsWith("http")) {
                        newFiles.add(
                                new WarrantyFile()
                                        .setWarranty(warranty)
                                        .setFilePath(item.getKey())
                                        .setFileId(item.getValue())
                        );
                    }
                }
            }

            var savedFiles = repository.saveAll(newFiles);

            log.info("File added successfully.");

            return mapper.toDto(savedFiles);
        } catch (IOException ex) {
            throw new WarrantyFileBadRequestException("Error occurred while uploading filePath. Message: " + ex.getMessage());
        }
    }

    public void deleteAllByFileIDs(long warrantyId, List<String> filesIDs, Authentication authentication) {
        log.info("Removing {} file(s) for warranty with ID {}.", filesIDs.size(), warrantyId);

        var files = repository.findAllByWarrantyIdAndIdIn(warrantyId, filesIDs);

        deleteAllFilesWithIdsIn(
                files
                        .stream()
                        .map(WarrantyFile::getFileId)
                        .toList()
        );
        repository.deleteAll(files);

        log.info("{} files removed successfully from warranty with ID {}.", files.size(), warrantyId);
    }

    private Map<String, String> uploadFile(MultipartFile file) throws IOException {
        var uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of());
        return Map.of(
                uploadResult.get(URL).toString(),
                uploadResult.get(PUBLIC_ID).toString()
        );
    }

    private List<Map<String, String>> uploadFiles(List<MultipartFile> files) throws IOException {
        List<Map<String, String>> filesData = new ArrayList<>();

        for (MultipartFile file : files) {
            filesData.add(uploadFile(file));
        }

        return filesData;
    }

    private boolean deleteByFileId(String fileId) {
        try {
            var result = cloudinary.uploader().destroy(fileId, emptyMap());

            return result.get("result").equals("ok");
        } catch (IOException e) {
            throw new WarrantyFileNotFoundException(fileId);
        }
    }

    public boolean deleteAllFilesWithIdsIn(List<String> fileIDs) {
        for (String fileId : fileIDs) {
            deleteByFileId(fileId);
        }
        return true;
    }
}

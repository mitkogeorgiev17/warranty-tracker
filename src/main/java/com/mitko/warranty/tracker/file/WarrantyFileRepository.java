package com.mitko.warranty.tracker.file;

import com.mitko.warranty.tracker.file.model.WarrantyFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarrantyFileRepository extends JpaRepository<WarrantyFile, Long> {
    List<WarrantyFile> findAllByWarrantyIdAndIdIn(long warrantyId, List<String> filesIDs);
}

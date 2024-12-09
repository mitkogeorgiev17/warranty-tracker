package com.mitko.warranty.tracker.file;

import com.mitko.warranty.tracker.file.model.WarrantyFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarrantyFileRepository extends JpaRepository<WarrantyFile, Long> {
}

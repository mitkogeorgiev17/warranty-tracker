package com.mitko.warranty.tracker.file;

import com.mitko.warranty.tracker.file.model.WarrantyFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WarrantyFileRepository extends JpaRepository<WarrantyFile, Long> {
}

package com.mitko.warranty.tracker.warranty;

import com.mitko.warranty.tracker.warranty.model.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    Optional<Warranty> findByIdAndUser_Id(long warrantyId, String name);
}

package com.mitko.warranty.tracker.warranty.repository;

import com.mitko.warranty.tracker.warranty.model.Warranty;
import com.mitko.warranty.tracker.warranty.model.WarrantyStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    Optional<Warranty> findByIdAndUser_Id(long warrantyId, String name);

    @EntityGraph(attributePaths = {"files"})
    List<Warranty> findAllByUser_Id(String name);

    List<Warranty> findByEndDateBeforeAndStatusIn(LocalDate date, List<WarrantyStatus> statuses);

    @Query(value = """
    SELECT
        COALESCE(SUM(CASE WHEN w.end_date < :oneMonthFromNow THEN 1 ELSE 0 END), 0) AS lessThanOneMonth,
        COALESCE(SUM(CASE WHEN w.end_date >= :oneMonthFromNow AND w.end_date < :oneYearFromNow THEN 1 ELSE 0 END), 0) AS oneToTwelveMonths,
        COALESCE(SUM(CASE WHEN w.end_date >= :oneYearFromNow THEN 1 ELSE 0 END), 0) AS moreThanOneYear
    FROM development.warranties w
    WHERE w.status IN (:statuses)
    AND w.user_id = :userId
    """, nativeQuery = true)
    WarrantyCountsProjection countExpiringWarranties(
            @Param("oneMonthFromNow") LocalDate oneMonthFromNow,
            @Param("oneYearFromNow") LocalDate oneYearFromNow,
            @Param("statuses") List<String> statuses,
            @Param("userId") String userId
    );

    List<Warranty> findAllByEndDate(LocalDate endDate);
}

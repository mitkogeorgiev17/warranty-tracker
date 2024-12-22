package com.mitko.warranty.tracker.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);

    Optional<Category> findByNameIgnoreCase(String name);

    @Query("""
            FROM Category c
            ORDER BY SIZE(c.warranties) DESC
            LIMIT 10
            """)
    List<Category> findTop10ByOrderByWarrantiesSizeDesc();

    @Query("""
            SELECT c
            FROM Warranty w
            JOIN w.category c
            WHERE w.user.id = :userId
            """)
    List<Category> findAllUserCategories(String userId);
}

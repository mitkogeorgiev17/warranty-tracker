package com.mitko.warranty.tracker.category.controller;

import com.mitko.warranty.tracker.category.CategoryName;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;

import java.util.List;

@Tag(name = "Category Operations")
public interface CategoryOperations {
    @Operation(summary = "Receives the most frequently used categories.")
    List<CategoryName> getCategories();

    @Operation(summary = "Receives all user categories.")
    List<CategoryName> getUserCategories(Authentication authentication);
}

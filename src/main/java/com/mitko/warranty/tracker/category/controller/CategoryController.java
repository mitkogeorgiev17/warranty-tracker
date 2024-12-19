package com.mitko.warranty.tracker.category.controller;

import com.mitko.warranty.tracker.category.CategoryName;
import com.mitko.warranty.tracker.category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1.0.0/categories")
@RequiredArgsConstructor
public class CategoryController implements CategoryOperations {
    private final CategoryService service;

    @Override
    @GetMapping("/")
    public List<CategoryName> getCategories() {
        return service.getMostUsedCategories();
    }
}

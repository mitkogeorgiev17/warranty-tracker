package com.mitko.warranty.tracker.category;

import com.mitko.warranty.tracker.mapper.CategoryMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CategoryService {
    private final CategoryRepository repository;
    private final CategoryMapper mapper;

    public List<CategoryName> getMostUsedCategories() {
        return mapper.mapCategory(repository.findTop10ByOrderByWarrantiesSizeDesc());
    }
}

package com.mitko.warranty.tracker.mapper;

import com.mitko.warranty.tracker.category.Category;
import com.mitko.warranty.tracker.category.CategoryName;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryName mapCategory(Category category);

    List<CategoryName> mapCategory(List<Category> categories);
}

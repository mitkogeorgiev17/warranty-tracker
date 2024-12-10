package com.mitko.warranty.tracker.mapper;

import com.mitko.warranty.tracker.file.model.WarrantyFile;
import com.mitko.warranty.tracker.file.model.WarrantyFileDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WarrantyFileMapper {
    WarrantyFileDTO toDto(WarrantyFile file);

    List<WarrantyFileDTO> toDto(List<WarrantyFile> files);
}

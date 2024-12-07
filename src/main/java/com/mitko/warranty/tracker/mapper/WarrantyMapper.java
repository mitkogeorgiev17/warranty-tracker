package com.mitko.warranty.tracker.mapper;

import com.mitko.warranty.tracker.warranty.model.Warranty;
import com.mitko.warranty.tracker.warranty.model.WarrantyDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WarrantyMapper {
    @Mapping(source = "note", target = "metadata.note")
    @Mapping(source = "createdAt", target = "metadata.createdAt")
    @Mapping(source = "updatedAt", target = "metadata.updatedAt")
    WarrantyDTO toDto(Warranty warranty);

    List<WarrantyDTO> toDto(List<Warranty> warranties);
}

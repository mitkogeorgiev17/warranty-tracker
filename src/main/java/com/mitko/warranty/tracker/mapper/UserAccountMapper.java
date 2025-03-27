package com.mitko.warranty.tracker.mapper;

import com.mitko.warranty.tracker.account.model.User;
import com.mitko.warranty.tracker.account.model.response.UserAccountResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserAccountMapper {
    @Mapping(target = "warrantyCountsProjection", ignore = true)
    UserAccountResponse toResponseBody(User user);
}

package com.mitko.warranty.tracker.mapper;

import com.mitko.warranty.tracker.account.model.User;
import com.mitko.warranty.tracker.account.model.UserAccountResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserAccountMapper {
    UserAccountResponse toResponseBody(User user);
}

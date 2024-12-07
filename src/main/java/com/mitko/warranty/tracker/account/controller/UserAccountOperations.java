package com.mitko.warranty.tracker.account.controller;

import com.mitko.warranty.tracker.account.model.UserAccountResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;

@Tag(name = "User Account Operations")
public interface UserAccountOperations {
    UserAccountResponse getLoggedUser(Authentication authentication);
}

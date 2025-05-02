package com.mitko.warranty.tracker.account.controller;

import com.mitko.warranty.tracker.account.UserAccountService;
import com.mitko.warranty.tracker.account.model.request.UpdateUserCommand;
import com.mitko.warranty.tracker.account.model.response.UserAccountResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1.0.0/account")
@RequiredArgsConstructor
public class UserAccountController implements UserAccountOperations{
    private final UserAccountService accountService;

    @Override
    @PostMapping("/")
    public UserAccountResponse getLoggedUser(Authentication authentication) {
        return accountService.getUser(authentication);
    }

    @Override
    @PutMapping("/")
    public void updateUser(Authentication authentication, @Valid @RequestBody UpdateUserCommand command) {
        accountService.updateUser(authentication, command);
    }
}

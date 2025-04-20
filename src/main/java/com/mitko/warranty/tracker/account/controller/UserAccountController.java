package com.mitko.warranty.tracker.account.controller;

import com.mitko.warranty.tracker.account.UserAccountService;
import com.mitko.warranty.tracker.account.model.request.UpdateUserCommand;
import com.mitko.warranty.tracker.account.model.response.UserAccountResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public void updateUser(Authentication authentication, UpdateUserCommand command) {
        accountService.updateUser(authentication, command);
    }


}

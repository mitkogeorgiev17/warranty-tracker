package com.mitko.warranty.tracker.authentication.controller;

import com.mitko.warranty.tracker.authentication.AuthenticationService;
import com.mitko.warranty.tracker.authentication.model.AuthenticationCommand;
import com.mitko.warranty.tracker.authentication.model.AuthenticationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1.0.0/auth")
@RequiredArgsConstructor
public class AuthenticationController implements AuthenticationOperations{
    private final AuthenticationService authenticationService;

    @Override
    @GetMapping("/code")
    public String getCodeUrl() {
        return authenticationService.getCodeUrl();
    }

    @Override
    @PostMapping("/authenticate")
    public AuthenticationResponse authenticate(@Valid @RequestBody AuthenticationCommand command) {
        return authenticationService.authenticate(command);
    }
}

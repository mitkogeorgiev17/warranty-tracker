package com.mitko.warranty.tracker.authentication.controller;

import com.mitko.warranty.tracker.authentication.AuthenticationService;
import com.mitko.warranty.tracker.authentication.model.AuthenticationCommand;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static org.springframework.http.MediaType.TEXT_PLAIN_VALUE;

@RestController
@RequestMapping("/api/v1.0.0/auth")
@RequiredArgsConstructor
public class AuthenticationController implements AuthenticationOperations{
    private final AuthenticationService authenticationService;

    @Override
    @GetMapping(value = "/code", produces = TEXT_PLAIN_VALUE)
    public String getCodeUrl() {
        return authenticationService.getCodeUrl();
    }

    @Override
    @PostMapping("/authenticate")
    public Map<String, String> authenticate(@Valid @RequestBody AuthenticationCommand command) {
        return authenticationService.authenticate(command);
    }
}

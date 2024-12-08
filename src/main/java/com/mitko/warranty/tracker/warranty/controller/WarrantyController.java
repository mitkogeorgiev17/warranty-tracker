package com.mitko.warranty.tracker.warranty.controller;

import com.mitko.warranty.tracker.warranty.WarrantyService;
import com.mitko.warranty.tracker.warranty.model.request.CreateWarrantyCommand;
import com.mitko.warranty.tracker.warranty.model.response.WarrantyDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1.0.0/warranties")
@RequiredArgsConstructor
public class WarrantyController implements WarrantyOperations {
    private final WarrantyService service;

    @Override
    @PostMapping("/")
    public WarrantyDTO createWarranty(@Valid @RequestBody CreateWarrantyCommand command, Authentication authentication) {
        return service.createWarranty(command, authentication);
    }
}

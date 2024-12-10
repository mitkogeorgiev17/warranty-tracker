package com.mitko.warranty.tracker.warranty.controller;

import com.mitko.warranty.tracker.warranty.WarrantyService;
import com.mitko.warranty.tracker.warranty.model.request.CreateWarrantyCommand;
import com.mitko.warranty.tracker.warranty.model.request.UpdateWarrantyCommand;
import com.mitko.warranty.tracker.warranty.model.response.WarrantyDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @Override
    @GetMapping("/")
    public List<WarrantyDTO> listUserWarranties(Authentication authentication) {
        return service.getAllUserWarranties(authentication);
    }

    @Override
    @GetMapping("/{warrantyId}")
    public WarrantyDTO getWarrantyById(@PathVariable("warrantyId") long warrantyId, Authentication authentication) {
        return service.getById(warrantyId, authentication);
    }

    @Override
    @PutMapping("/")
    public WarrantyDTO updateWarranty(UpdateWarrantyCommand command, Authentication authentication) {
        return service.updateWarranty(command, authentication);
    }

    @Override
    @DeleteMapping("/{warrantyId}")
    public void deleteWarranty(@PathVariable("warrantyId") long warrantyId, Authentication authentication) {
        service.deleteWarranty(warrantyId, authentication);
    }
}

package com.mitko.warranty.tracker.warranty.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1.0.0/warranties")
@RequiredArgsConstructor
public class WarrantyController implements WarrantyOperations{
}

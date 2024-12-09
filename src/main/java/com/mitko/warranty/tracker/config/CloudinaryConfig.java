package com.mitko.warranty.tracker.config;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static com.cloudinary.Cloudinary.asMap;

@Configuration
@RequiredArgsConstructor
public class CloudinaryConfig {
    @Value("${cloudinary.name}")
    private String name;
    @Value("${cloudinary.api-key}")
    private String apiKey;
    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(asMap(
                "cloud_name", name,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }
}

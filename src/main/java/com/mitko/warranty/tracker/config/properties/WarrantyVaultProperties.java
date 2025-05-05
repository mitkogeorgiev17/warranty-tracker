package com.mitko.warranty.tracker.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties
public record WarrantyVaultProperties(
        KeycloakProperties keycloak,
        OpenAiProperties openai
) {
}

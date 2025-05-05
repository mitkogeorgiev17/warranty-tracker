package com.mitko.warranty.tracker.config.properties;

public record KeycloakProperties (
        String tokenEndpoint,
        String codeUrl,
        String clientId,
        String clientSecret,
        String redirectUri
){
}

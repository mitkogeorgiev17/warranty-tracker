package com.mitko.warranty.tracker.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "keycloak")
public class KeycloakProperties {
    private String tokenEndpoint;
    private String codeUrl;
    private String clientId;
    private String clientSecret;
}

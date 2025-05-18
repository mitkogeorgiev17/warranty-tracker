package com.mitko.warranty.tracker.authentication;

import com.mitko.warranty.tracker.authentication.model.AuthenticationCommand;
import com.mitko.warranty.tracker.authentication.model.AuthenticationResponse;
import com.mitko.warranty.tracker.config.properties.WarrantyVaultProperties;
import com.mitko.warranty.tracker.exception.custom.AuthorizationException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Map;

import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final WarrantyVaultProperties properties;
    private final RestClient restClient;

    public String getCodeUrl() {
        return properties.keycloak().codeUrl();
    }

    public Map<String, String> authenticate(@Valid AuthenticationCommand command) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("client_id", properties.keycloak().clientId());
        formData.add("client_secret", properties.keycloak().clientSecret());
        formData.add("code", command.code());
        formData.add("redirect_uri", properties.keycloak().redirectUri());

        log.info(command.code());

        var authResponse = restClient
                .post()
                .uri(properties.keycloak().tokenEndpoint())
                .accept(APPLICATION_JSON)
                .contentType(APPLICATION_FORM_URLENCODED)
                .body(formData)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    throw new AuthorizationException("Error occurred while receiving Keycloak token. " + res.getStatusText());
                })
                .body(AuthenticationResponse.class);

        if (authResponse != null && isNotBlank(authResponse.accessToken())) {
            log.info("JWT Token generated successfully.");
            return Map.of("token", authResponse.accessToken());
        }
        else
            throw new RuntimeException("Error occurred while receiving Keycloak token.");
    }
}

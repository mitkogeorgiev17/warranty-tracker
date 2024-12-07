package com.mitko.warranty.tracker.authentication;

import com.mitko.warranty.tracker.authentication.model.AuthenticationCommand;
import com.mitko.warranty.tracker.authentication.model.AuthenticationResponse;
import com.mitko.warranty.tracker.config.properties.KeycloakProperties;
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
    private final KeycloakProperties keycloakProperties;
    private final RestClient restClient;

    public String getCodeUrl() {
        return keycloakProperties.getCodeUrl();
    }

    public Map<String, String> authenticate(@Valid AuthenticationCommand command) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("client_id", keycloakProperties.getClientId());
        formData.add("client_secret", keycloakProperties.getClientSecret());
        formData.add("code", command.code());

        var authResponse = restClient
                .post()
                .uri(keycloakProperties.getTokenEndpoint())
                .accept(APPLICATION_JSON)
                .contentType(APPLICATION_FORM_URLENCODED)
                .body(formData)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    throw new AuthorizationException("Error occurred while receiving Keycloak token.");
        })
                .body(AuthenticationResponse.class);

        if (authResponse != null && isNotBlank(authResponse.accessToken()))
            return Map.of("token", authResponse.accessToken());
        else
            throw new RuntimeException("Error occurred while receiving Keycloak token.");
    }
}

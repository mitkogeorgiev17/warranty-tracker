package com.mitko.warranty.tracker.authentication;

import com.mitko.warranty.tracker.exception.custom.AuthorizationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Map;

public class AuthenticationUtils {
    public static Map<String, Object> getClaims(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuthenticationToken) {
            return jwtAuthenticationToken.getToken().getClaims();
        } else {
            throw new AuthorizationException("Authentication object is not a JwtAuthenticationToken");
        }
    }
}

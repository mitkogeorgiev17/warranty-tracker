package com.mitko.warranty.tracker.account;

import com.mitko.warranty.tracker.account.model.User;
import com.mitko.warranty.tracker.account.model.UserAccountResponse;
import com.mitko.warranty.tracker.mapper.UserAccountMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import static com.mitko.warranty.tracker.account.AuthenticationUtils.getClaims;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserAccountService {
    private final UserRepository userRepository;
    private final UserAccountMapper mapper;

    public UserAccountResponse getUser(Authentication authentication) {
        log.info("Receiving user account for {}.", authentication.getName());

        var user = userRepository.findById(authentication.getName())
                .orElseGet(() -> createNewUserRecord(authentication));

        return mapper.toResponseBody(user);
    }

    private User createNewUserRecord(Authentication authentication) {
        log.info("User not found in DB. Creating new record.");

        var claims = getClaims(authentication);

        var newUser = new User()
                .setId(claims.get("sub").toString())
                .setUsername(claims.get("preferred_username").toString())
                .setEmail(claims.get("email").toString())
                .setFirstName(claims.get("given_name").toString())
                .setLastName(claims.get("family_name").toString());

        var savedUser = userRepository.save(newUser);

        log.info("New user saved successfully. Username: {}", savedUser.getUsername());

        return savedUser;
    }
}

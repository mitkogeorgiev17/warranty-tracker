package com.mitko.warranty.tracker.account;

import com.mitko.warranty.tracker.account.model.User;
import com.mitko.warranty.tracker.account.model.request.UpdateUserCommand;
import com.mitko.warranty.tracker.account.model.response.UserAccountResponse;
import com.mitko.warranty.tracker.exception.custom.UserNotFoundException;
import com.mitko.warranty.tracker.mapper.UserAccountMapper;
import com.mitko.warranty.tracker.notification.push.UserDeviceTokenRepository;
import com.mitko.warranty.tracker.warranty.repository.WarrantyCountsProjection;
import com.mitko.warranty.tracker.warranty.repository.WarrantyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static com.mitko.warranty.tracker.authentication.AuthenticationUtils.getClaims;
import static com.mitko.warranty.tracker.warranty.model.WarrantyStatus.ACTIVE;
import static com.mitko.warranty.tracker.warranty.model.WarrantyStatus.CLAIMED_ACTIVE;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserAccountService {
    private final UserRepository userRepository;
    private final UserAccountMapper mapper;
    private final WarrantyRepository warrantyRepository;
    private final UserDeviceTokenRepository userDeviceTokenRepository;

    public UserAccountResponse getUser(Authentication authentication) {
        log.info("Receiving user account for {}.", authentication.getName());

        var user = userRepository.findById(authentication.getName())
                .orElseGet(() -> createNewUserRecord(authentication));

        return mapper.toResponseBody(user)
                .setWarrantyCountsProjection(getWarrantyCounts(authentication));
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

    public WarrantyCountsProjection getWarrantyCounts(Authentication authentication) {
        LocalDate today = LocalDate.now();
        LocalDate oneMonthFromNow = today.plusMonths(1);
        LocalDate oneYearFromNow = today.plusYears(1);

        List<String> statusStrings = List.of(ACTIVE.name(), CLAIMED_ACTIVE.name());

        return warrantyRepository.countExpiringWarranties(
                oneMonthFromNow,
                oneYearFromNow,
                statusStrings,
                authentication.getName()
        );
    }

    public void updateUser(Authentication authentication, UpdateUserCommand command) {
        log.info("Updating user {}.", authentication.getName());

        var user = userRepository.findById(authentication.getName())
                        .orElseThrow(() -> new UserNotFoundException(authentication.getName()));

        user
                .setLanguage(command.getUpdatedLanguage() != null ? command.getUpdatedLanguage() : user.getLanguage())
                .setEmailNotifications(command.getUpdatedEmailNotifications() != null ? command.getUpdatedEmailNotifications() : user.isEmailNotifications());

        if (command.getUpdatedPushNotifications() != null) {
            var userDeviceTokens = userDeviceTokenRepository.findByUserIdAndIsActiveTrue(authentication.getName());

            userDeviceTokens.forEach(udt -> udt.setIsActive(command.getUpdatedPushNotifications()));

            userDeviceTokenRepository.saveAll(userDeviceTokens);

            user.setPushNotifications(true);
        }

        userRepository.save(user);

        log.info("Successfully updated user {}.", authentication.getName());
    }
}

package com.mitko.warranty.tracker.warranty;

import com.mitko.warranty.tracker.account.UserRepository;
import com.mitko.warranty.tracker.exception.custom.UserNotFoundException;
import com.mitko.warranty.tracker.exception.custom.WarrantyBadRequest;
import com.mitko.warranty.tracker.mapper.WarrantyMapper;
import com.mitko.warranty.tracker.warranty.model.Warranty;
import com.mitko.warranty.tracker.warranty.model.WarrantyStatus;
import com.mitko.warranty.tracker.warranty.model.request.CreateWarrantyCommand;
import com.mitko.warranty.tracker.warranty.model.response.WarrantyDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static com.mitko.warranty.tracker.warranty.model.WarrantyStatus.ACTIVE;
import static com.mitko.warranty.tracker.warranty.model.WarrantyStatus.EXPIRED;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class WarrantyService {
    private final WarrantyRepository warrantyRepository;
    private final UserRepository userRepository;
    private final WarrantyMapper mapper;

    /**
     * Creates a new warranty record in the DB. Validates the request for invalid dates.
     * @param command contains required info for saving absence: Name, Start date, End date, Notes (optional)
     * @param authentication attaches the saved warranty to the logged user (extracted from the Authentication)
     * @throws UserNotFoundException if authenticated user is not existent in DB.
     * @return Warranty mapped to a DTO
     * @see WarrantyDTO
     */
    public WarrantyDTO createWarranty(CreateWarrantyCommand command, Authentication authentication) {
        var user = userRepository.findById(authentication.getName())
                        .orElseThrow(() -> new UserNotFoundException(authentication.getName()));

        log.info("Saving new warranty. Name: {}. User: {}", command.name(), user.getUsername());

        validate(command);

        var warranty = new Warranty()
                .setName(command.name())
                .setStartDate(command.startDate())
                .setEndDate(command.endDate())
                .setStatus(getStatus(command.endDate()))
                .setNote(command.note())
                .setCreatedAt(LocalDateTime.now());

        var savedWarranty = warrantyRepository.save(warranty);

        log.info("Warranty saved successfully.");

        return mapper.toDto(savedWarranty);
    }

    /**
     * Validates a warranty request body for invalid data.
     * @throws WarrantyBadRequest if dates are invalid.
     * @param command
     */
    private void validate(CreateWarrantyCommand command) {
        log.info("Validating warranty.");

        var startDate = command.startDate();
        var endDate = command.endDate();

        if (startDate.isAfter(endDate)) {
            throw new WarrantyBadRequest("Invalid dates: Start date can't be after end date.");
        }

        log.info("Validation successful.");
    }

    public WarrantyStatus getStatus(LocalDate endDate) {
        var now = LocalDate.now();

        return now.isBefore(endDate) ? ACTIVE : EXPIRED;
    }
}

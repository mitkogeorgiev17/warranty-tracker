package com.mitko.warranty.tracker.warranty;

import com.mitko.warranty.tracker.account.UserRepository;
import com.mitko.warranty.tracker.category.Category;
import com.mitko.warranty.tracker.category.CategoryRepository;
import com.mitko.warranty.tracker.exception.custom.UserNotFoundException;
import com.mitko.warranty.tracker.exception.custom.WarrantyBadRequest;
import com.mitko.warranty.tracker.exception.custom.WarrantyNotFoundException;
import com.mitko.warranty.tracker.file.WarrantyFileService;
import com.mitko.warranty.tracker.file.model.WarrantyFile;
import com.mitko.warranty.tracker.mapper.WarrantyMapper;
import com.mitko.warranty.tracker.warranty.model.Warranty;
import com.mitko.warranty.tracker.warranty.model.WarrantyStatus;
import com.mitko.warranty.tracker.warranty.model.request.CreateWarrantyCommand;
import com.mitko.warranty.tracker.warranty.model.request.UpdateWarrantyCommand;
import com.mitko.warranty.tracker.warranty.model.response.WarrantyDTO;
import com.mitko.warranty.tracker.warranty.repository.WarrantyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static com.mitko.warranty.tracker.warranty.model.WarrantyStatus.*;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class WarrantyService {
    private final WarrantyFileService warrantyFileService;
    private final WarrantyRepository warrantyRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final WarrantyMapper mapper;

    /**
     * Creates a new warranty record in the DB. Validates the request for invalid dates.
     *
     * @param command        contains required info for saving absence: Name, Start date, End date, Notes (optional)
     * @param authentication attaches the saved warranty to the logged user (extracted from the Authentication)
     * @return Warranty mapped to a DTO
     * @throws UserNotFoundException if authenticated user is not existent in DB.
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
                .setUser(user)
                .setNote(command.note())
                .setCategory(command.category() != null ? findCategory(command.category()) : null)

                .setCreatedAt(LocalDateTime.now());

        var savedWarranty = warrantyRepository.save(warranty);

        log.info("Warranty saved successfully.");

        return mapper.toDto(savedWarranty);
    }

    private Category findCategory(String name) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> createNewCategory(name));
    }

    private Category createNewCategory(String name) {
        return categoryRepository.save(new Category().setName(name));
    }

    /**
     * Validates a warranty request body for invalid data.
     *
     * @param command
     * @throws WarrantyBadRequest if dates are invalid.
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

    public List<WarrantyDTO> getAllUserWarranties(Authentication authentication) {
        log.info("Receiving all user warranties for user {}.", authentication.getName());

        if (!userRepository.existsById(authentication.getName())) {
            throw new UserNotFoundException(authentication.getName());
        }

        var warranties = warrantyRepository.findAllByUser_Id(authentication.getName());

        log.info("Warranties received successfully.");

        return mapper.toDto(warranties);
    }

    public WarrantyDTO getById(long warrantyId, Authentication authentication) {
        log.info("Receiving a warranty with ID {}.", warrantyId);

        return mapper.toDto(
                warrantyRepository.findByIdAndUser_Id(warrantyId, authentication.getName())
                        .orElseThrow(() -> new WarrantyNotFoundException(warrantyId))
        );
    }

    public WarrantyDTO updateWarranty(UpdateWarrantyCommand command, Authentication authentication) {
        log.info("Updating warranty with ID {}.", command.warrantyId());

        var warranty = warrantyRepository.findByIdAndUser_Id(command.warrantyId(), authentication.getName())
                .orElseThrow(() -> new WarrantyNotFoundException(command.warrantyId()));

        warranty
                .setName(command.name() != null ? command.name() : warranty.getName())
                .setStartDate(command.startDate() != null ? command.startDate() : warranty.getStartDate())
                .setEndDate(command.endDate() != null ? command.endDate() : warranty.getEndDate())
                .setStatus(command.status() != null ? command.status() : warranty.getStatus())
                .setNote(command.note() != null ? command.note() : warranty.getNote())
                .setUpdatedAt(LocalDateTime.now());

        var savedWarranty = warrantyRepository.save(warranty);

        log.info("Warranty updated successfully.");

        return mapper.toDto(savedWarranty);
    }

    public void deleteWarranty(long warrantyId, Authentication authentication) {
        log.info("Deleting warranty with ID {}.", warrantyId);

        var warranty = warrantyRepository.findByIdAndUser_Id(warrantyId, authentication.getName())
                .orElseThrow(() -> new WarrantyNotFoundException(warrantyId));

        var warrantyFilesIDs = warranty.getFiles()
                .stream()
                .map(WarrantyFile::getFileId)
                .toList();

        warrantyFileService.deleteAllFilesWithIdsIn(warrantyFilesIDs);
        warrantyRepository.delete(warranty);

        log.info("Warranty deleted successfully.");
    }

    public void updateExpiringWarranties(LocalDate today) {
        var allExpiringWarranties = warrantyRepository.findByEndDateBeforeAndStatusIn(today, List.of(ACTIVE, CLAIMED_ACTIVE));

        allExpiringWarranties
                .forEach(warranty -> {
                    if (warranty.getStatus() == ACTIVE) {
                        warranty.setStatus(EXPIRED);
                    }
                    if (warranty.getStatus() == CLAIMED_ACTIVE) {
                        warranty.setStatus(CLAIMED_EXPIRED);
                    }
                });

        warrantyRepository.saveAll(allExpiringWarranties);

        log.info("New {} expired warranties as of {} have been updated.", allExpiringWarranties.size(), today);
    }
}

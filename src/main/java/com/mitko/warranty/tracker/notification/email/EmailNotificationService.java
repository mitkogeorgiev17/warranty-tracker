package com.mitko.warranty.tracker.notification.email;

import com.mitko.warranty.tracker.config.properties.WarrantyVaultProperties;
import com.mitko.warranty.tracker.warranty.model.Warranty;
import com.mitko.warranty.tracker.warranty.repository.WarrantyRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import static com.mitko.warranty.tracker.account.model.Language.BG;
import static com.mitko.warranty.tracker.account.model.Language.EN;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationService {
    public static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd-MM-yyyy", Locale.getDefault());
    private final WarrantyVaultProperties properties;
    private final WarrantyRepository warrantyRepository;
    private final JavaMailSender mailSender;

    public Map<String, Warranty> sendNotificationsForExpiringWarranties(LocalDate today) {
        log.info("Sending notifications for expiring warranties. Today: {}", today);

        var allExpiringIn1Month = warrantyRepository.findAllByEndDate(today.plusMonths(1));

        for (Warranty warranty : allExpiringIn1Month) {
            if (warranty.getUser().isEmailNotifications()) {
                if (warranty.getUser().getLanguage() == BG) {
                    sendEmail(
                            warranty.getUser().getEmail(),
                            properties.emailTemplate().bg().subject(),
                            properties.emailTemplate().bg().body()
                                    .replace("${warrantyName}", warranty.getName())
                                    .replace("${remaining}", "1 месец")
                                    .replace("${startDate}", warranty.getStartDate().format(DATE_FORMATTER))
                                    .replace("${endDate}", warranty.getEndDate().format(DATE_FORMATTER))
                    );
                } else if (warranty.getUser().getLanguage() == EN) {
                    sendEmail(
                            warranty.getUser().getEmail(),
                            properties.emailTemplate().bg().subject(),
                            properties.emailTemplate().bg().body()
                                    .replace("${warrantyName}", warranty.getName())
                                    .replace("${remaining}", "1 month")
                                    .replace("${startDate}", warranty.getStartDate().format(DATE_FORMATTER))
                                    .replace("${endDate}", warranty.getEndDate().format(DATE_FORMATTER))
                    );
                }
            }
        }

        return allExpiringIn1Month.stream()
                .filter(warranty -> warranty.getUser().isPushNotifications())
                .collect(Collectors.toMap(
                        warranty -> warranty.getUser().getId(),
                        warranty -> warranty
                ));
    }

    public void sendEmail(
            String to,
            String subject,
            String htmlBody
    ) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(mimeMessage);

            log.info("HTML email sent successfully to {}.", to);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email", e);
            throw new RuntimeException("Failed to send HTML email", e);
        }
    }
}

package com.mitko.warranty.tracker.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.List;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Bean
    public FirebaseMessaging firebaseMessaging() throws IOException {
        // Use your existing service account JSON file
        GoogleCredentials googleCredentials = GoogleCredentials
                .fromStream(new ClassPathResource("google-credentials.json").getInputStream())
                .createScoped(List.of("https://www.googleapis.com/auth/firebase.messaging"));

        FirebaseOptions firebaseOptions = FirebaseOptions.builder()
                .setCredentials(googleCredentials)
                .setProjectId("supple-voyage-458619-j4")
                .build();

        FirebaseApp app;
        try {
            app = FirebaseApp.getInstance();
        } catch (IllegalStateException e) {
            app = FirebaseApp.initializeApp(firebaseOptions);
        }

        log.info("Firebase initialized successfully for project: supple-voyage-458619-j4");
        return FirebaseMessaging.getInstance(app);
    }
}
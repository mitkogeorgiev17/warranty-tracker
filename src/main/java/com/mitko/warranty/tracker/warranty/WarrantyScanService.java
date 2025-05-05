package com.mitko.warranty.tracker.warranty;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import com.mitko.warranty.tracker.config.properties.WarrantyVaultProperties;
import com.mitko.warranty.tracker.exception.custom.OCRException;
import com.mitko.warranty.tracker.warranty.model.request.CreateWarrantyCommand;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class WarrantyScanService {

    @Value("${google.cloud.credentials.location}")
    private Resource credentialsResource;

    private final WarrantyVaultProperties properties;

    private final ChatClient chatClient;

    public CreateWarrantyCommand scanWarranty(MultipartFile file) {
        log.info("Scanning warranty file and extracting information...");

        try {
            var extractedText = extractTextFromImage(file);

            String chatResponse = chatClient
                    .prompt(properties.openai().prompt() + extractedText)
                    .call()
                    .content();

            log.info("OPENAI RESPONSE: {}" ,chatResponse);

            return parseToResponse(chatResponse);
        } catch (Exception e) {
            log.error("Error scanning warranty document", e);
            throw new RuntimeException("Failed to scan warranty document: " + e.getMessage(), e);
        }
    }

    private CreateWarrantyCommand parseToResponse(String chatResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            // Configure date/time module to handle Java 8 date types
            mapper.registerModule(new JavaTimeModule());
            // Configure mapper for more flexibility
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE, true);

            // Extract the JSON part from the response if needed
            String jsonPart = extractJsonFromResponse(chatResponse);

            // Log the JSON we're trying to parse for debugging
            log.debug("Attempting to parse JSON: {}", jsonPart);

            return mapper.readValue(jsonPart, CreateWarrantyCommand.class);
        } catch (Exception e) {
            log.error("Error parsing AI response: {}", chatResponse, e);
            throw new OCRException("Could not parse AI response: " + e.getMessage());
        }
    }

    private String extractJsonFromResponse(String response) {
        // If the response contains multiple parts or extra text, extract just the JSON
        int startBrace = response.indexOf('{');
        int endBrace = response.lastIndexOf('}');

        if (startBrace >= 0 && endBrace > startBrace) {
            return response.substring(startBrace, endBrace + 1);
        }

        return response; // Return original if no JSON object found
    }

    /**
     * Extracts text from an image using Google Cloud Vision OCR
     *
     * @param file The multipart file containing the image
     * @return Extracted text from the image
     * @throws IOException If an error occurs during processing
     */
    public String extractTextFromImage(MultipartFile file) throws IOException {
        ImageAnnotatorClient client = createVisionClient();

        try {
            // Convert multipart file to Vision API format
            ByteString imgBytes = ByteString.copyFrom(file.getBytes());
            Image image = Image.newBuilder().setContent(imgBytes).build();

            // Create OCR feature request
            Feature feature = Feature.newBuilder()
                    .setType(Feature.Type.TEXT_DETECTION)
                    .build();

            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feature)
                    .setImage(image)
                    .build();

            List<AnnotateImageRequest> requests = new ArrayList<>();
            requests.add(request);

            // Perform OCR
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
            List<AnnotateImageResponse> responses = response.getResponsesList();

            // Process the response
            StringBuilder extractedText = new StringBuilder();
            for (AnnotateImageResponse res : responses) {
                if (res.hasError()) {
                    throw new OCRException("Error performing OCR: " + res.getError().getMessage());
                }

                // Get full text annotation
                TextAnnotation annotation = res.getFullTextAnnotation();
                extractedText.append(annotation.getText());
            }

            return extractedText.toString();
        } finally {
            client.close();
        }
    }

    /**
     * Creates a Vision API client using the credentials from the resource file
     */
    private ImageAnnotatorClient createVisionClient() throws IOException {
        GoogleCredentials credentials = GoogleCredentials.fromStream(
                credentialsResource.getInputStream());

        ImageAnnotatorSettings settings = ImageAnnotatorSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .build();

        return ImageAnnotatorClient.create(settings);
    }
}
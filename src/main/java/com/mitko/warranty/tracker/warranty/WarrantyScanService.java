package com.mitko.warranty.tracker.warranty;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import com.mitko.warranty.tracker.config.properties.WarrantyVaultProperties;
import com.mitko.warranty.tracker.exception.custom.OCRException;
import com.mitko.warranty.tracker.openai.OpenAiClient;
import com.mitko.warranty.tracker.warranty.model.request.CreateWarrantyCommand;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final OpenAiClient openAiClient;

    public CreateWarrantyCommand scanWarranty(MultipartFile file) {
        log.info("Scanning warranty file and extracting information...");

        try {
            var extractedText = extractTextFromImage(file);

            String chatResponse = openAiClient.callOpenAI(properties.openai().prompt() + extractedText);

            log.info("OPENAI RESPONSE: {}" ,chatResponse);

            return openAiClient.parseToResponse(chatResponse, CreateWarrantyCommand.class);
        } catch (Exception e) {
            log.error("Error scanning warranty document", e);
            throw new RuntimeException("Failed to scan warranty document: " + e.getMessage(), e);
        }
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
package com.mitko.warranty.tracker.openai;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mitko.warranty.tracker.config.properties.WarrantyVaultProperties;
import com.mitko.warranty.tracker.exception.custom.OCRException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OpenAiClient {
    private final WarrantyVaultProperties properties;

    private final ChatClient chatClient;

    public String callOpenAI(String prompt) {
        try {
            return chatClient
                    .prompt(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Error calling OpenAI with extracted text", e);
            throw new OCRException("Failed to retrieve AI response: " + e.getMessage());
        }
    }

    public  <T> T parseToResponse(String chatResponse, Class<T> responseType) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE, true);

            String jsonPart = extractJsonFromResponse(chatResponse);

            log.debug("Attempting to parse JSON: {}", jsonPart);

            return mapper.readValue(jsonPart, responseType);
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

}

package com.mitko.warranty.tracker.warranty;

import com.mitko.warranty.tracker.config.properties.WarrantyVaultProperties;
import com.mitko.warranty.tracker.exception.custom.WarrantyNotFoundException;
import com.mitko.warranty.tracker.openai.OpenAiClient;
import com.mitko.warranty.tracker.warranty.model.response.AdvisorCommonQuestionsResponse;
import com.mitko.warranty.tracker.warranty.model.response.QuestionAnswerResponse;
import com.mitko.warranty.tracker.warranty.repository.WarrantyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class WarrantyAdvisorService {
    private final WarrantyVaultProperties properties;
    private final OpenAiClient openAiClient;
    private final WarrantyRepository warrantyRepository;

    public AdvisorCommonQuestionsResponse getCommonQuestions(Authentication authentication, long warrantyId) {
        log.info("Receiving common questions about warranty with ID {}.", warrantyId);

        var warranty = warrantyRepository.findByIdAndUser_Id(warrantyId, authentication.getName())
                .orElseThrow(() -> new WarrantyNotFoundException(warrantyId));

        String prompt = properties.openai().advisor().sampleQuestionsPrompt() + warranty.details();

        String response = openAiClient.callOpenAI(prompt);

        return openAiClient.parseToResponse(response, AdvisorCommonQuestionsResponse.class);
    }

    public QuestionAnswerResponse answerUserQuestion(Authentication authentication, long warrantyId, String question) {
        log.info("Answering user question about warranty with ID {}. Question: {}", warrantyId, question);

        var warranty = warrantyRepository.findByIdAndUser_Id(warrantyId, authentication.getName())
                .orElseThrow(() -> new WarrantyNotFoundException(warrantyId));

        String prompt = properties.openai().advisor().userQuestionPrompt().concat(warranty.details()).concat(" Question: " + question);

        String response = openAiClient.callOpenAI(prompt);

        return openAiClient.parseToResponse(response, QuestionAnswerResponse.class);
    }
}

package com.dms.controller;

import com.dms.dto.NewsletterSubscribeRequest;
import com.dms.entity.NewsletterSubscription;
import com.dms.repository.NewsletterSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterSubscriptionRepository newsletterRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody NewsletterSubscribeRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email address is required."));
        }

        String email = request.getEmail().trim().toLowerCase();
        if (!email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email format."));
        }

        if (newsletterRepository.existsByEmail(email)) {
            return ResponseEntity.ok(Map.of("message", "You are already subscribed to the newsletter!"));
        }

        NewsletterSubscription subscription = NewsletterSubscription.builder()
                .email(email)
                .build();
        newsletterRepository.save(subscription);

        return ResponseEntity.ok(Map.of("message", "Successfully subscribed to the newsletter!"));
    }
}

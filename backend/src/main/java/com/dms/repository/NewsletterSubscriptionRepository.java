package com.dms.repository;

import com.dms.entity.NewsletterSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NewsletterSubscriptionRepository extends JpaRepository<NewsletterSubscription, Long> {
    boolean existsByEmail(String email);
    Optional<NewsletterSubscription> findByEmail(String email);
}

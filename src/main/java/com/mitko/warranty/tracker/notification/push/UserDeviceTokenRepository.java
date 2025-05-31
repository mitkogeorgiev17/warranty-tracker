package com.mitko.warranty.tracker.notification.push;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDeviceTokenRepository extends JpaRepository<UserDeviceToken, Long> {

    List<UserDeviceToken> findByUserIdAndIsActiveTrue(String userId);

    Optional<UserDeviceToken> findByUserIdAndDeviceToken(String userId, String deviceToken);

    long countByUserIdAndIsActiveTrue(String userId);
}

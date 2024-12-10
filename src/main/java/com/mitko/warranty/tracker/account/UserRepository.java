package com.mitko.warranty.tracker.account;

import com.mitko.warranty.tracker.account.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}

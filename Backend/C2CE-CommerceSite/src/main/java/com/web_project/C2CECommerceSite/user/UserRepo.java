package com.web_project.C2CECommerceSite.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepo extends JpaRepository<User,UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(UUID userId);

}

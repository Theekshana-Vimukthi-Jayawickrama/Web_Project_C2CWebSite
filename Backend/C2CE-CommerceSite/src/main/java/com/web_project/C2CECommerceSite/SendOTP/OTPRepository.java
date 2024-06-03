package com.web_project.C2CECommerceSite.SendOTP;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OTPRepository extends JpaRepository<OTP,Integer> {
    Optional<OTP> findByEmail(String email);
}

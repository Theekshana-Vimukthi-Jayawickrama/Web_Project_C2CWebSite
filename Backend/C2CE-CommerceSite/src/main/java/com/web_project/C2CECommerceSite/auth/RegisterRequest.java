package com.web_project.C2CECommerceSite.auth;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String fullName;
    private String nickName;
    private String dob;
    private String gender;
    private String address;
    private String telephone;
    private  String email;
    private String password;

}

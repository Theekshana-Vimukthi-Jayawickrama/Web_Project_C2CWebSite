package com.web_project.C2CECommerceSite.user;

import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private UUID userId;
    private String fullName;
    private String nickName;
    private String dob;
    private String email;
    private String role;
    private String gender;
    private String address;
    private String telephone;
}

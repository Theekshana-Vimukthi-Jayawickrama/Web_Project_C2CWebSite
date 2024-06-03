package com.web_project.C2CECommerceSite.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class GetShortAdminDetailsResponse {
    private String fullName;
    private String userName;
    private String role;
    private UUID id;
    private boolean status;
}

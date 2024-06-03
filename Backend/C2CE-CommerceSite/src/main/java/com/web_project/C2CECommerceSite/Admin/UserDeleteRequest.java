package com.web_project.C2CECommerceSite.Admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDeleteRequest {
    private String reason;
    private String role;
}

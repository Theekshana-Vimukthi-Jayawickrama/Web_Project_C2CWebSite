package com.web_project.C2CECommerceSite.Admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class GetAllAdminDetailsResponse {
    private String fullName;
    private String nickName;
    private String dob;
    private String address;
    private String gender;
    private String telephoneNumber;
    private String email;
    private String role;
    private String id;

}

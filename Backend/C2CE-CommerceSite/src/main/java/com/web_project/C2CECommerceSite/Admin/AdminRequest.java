package com.web_project.C2CECommerceSite.Admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminRequest {
    private String name;
    private String adminNo;
    private String mobileNo;
    private String description;
    private String address;
    private AdminPhoto adminPhoto;
}

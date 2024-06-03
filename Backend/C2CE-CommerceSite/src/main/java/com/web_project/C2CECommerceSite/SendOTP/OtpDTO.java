package com.web_project.C2CECommerceSite.SendOTP;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OtpDTO {

    private String email;
    private Integer otp;
}

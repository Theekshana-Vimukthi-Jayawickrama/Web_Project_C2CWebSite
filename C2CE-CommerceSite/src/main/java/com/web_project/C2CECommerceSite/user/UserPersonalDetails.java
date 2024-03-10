package com.web_project.C2CECommerceSite.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "UserPersonalDetails")
public class UserPersonalDetails {
    @Id
    private int id;
    private String fullName;
    private String nickName;
    private String dob;
    private String gender;
    private String address;
    private String telephone;
}

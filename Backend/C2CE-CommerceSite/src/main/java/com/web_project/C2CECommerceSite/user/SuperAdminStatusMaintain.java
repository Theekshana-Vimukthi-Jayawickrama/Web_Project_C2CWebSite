package com.web_project.C2CECommerceSite.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class SuperAdminStatusMaintain {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private boolean status;
}

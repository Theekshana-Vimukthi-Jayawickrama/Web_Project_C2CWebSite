package com.web_project.C2CECommerceSite.AddItems;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class DeleteItem {
    @Id
    private long deleteItemId;
    private String title;
    private String deviceType;
    private String brand;
    private String description;
    private Double price;
    private String phoneNumber;
    private String itemCondition;
    private String place;
    private LocalDate postAddedDate;
    private String model;
    private LocalDate lastModifyDate;
    private boolean status;
    private String reason;
    private UUID adsRemoveUserId;
    private String deletedBy;
    private UUID userId;
}

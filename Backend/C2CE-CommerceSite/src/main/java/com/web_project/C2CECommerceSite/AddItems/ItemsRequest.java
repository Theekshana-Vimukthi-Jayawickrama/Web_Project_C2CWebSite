package com.web_project.C2CECommerceSite.AddItems;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemsRequest {
    private String title;
    private String deviceType;
    private String brand;
    private String description;
    private Double price;
    private String phoneNumber;
    private String itemCondition;
    private String place;
    private String model;
}

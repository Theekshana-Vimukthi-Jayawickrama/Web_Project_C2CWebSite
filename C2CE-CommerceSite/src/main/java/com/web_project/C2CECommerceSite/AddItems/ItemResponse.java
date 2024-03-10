package com.web_project.C2CECommerceSite.AddItems;

import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemResponse {
    private long id;
    private String title;
    private String deviceType;
    private String brand;
    private String description;
    private Double price;
    private String phoneNumber;
    private String itemCondition;
    private String place;
    private LocalDate date;
    private boolean status;
    private ItemPhoto1 itemPhoto1;
    private ItemPhoto2 itemPhoto2;
    private ItemPhoto3 itemPhoto3;
    private String model;
    private LocalDate lastModifyDate;

    public  ItemResponse (Items items, ItemPhoto1 itemPhoto1,ItemPhoto2 itemPhoto2, ItemPhoto3 itemPhoto3){
        this.id = items.getId();
        this.brand = items.getBrand();
        this.date = items.getPostAddedDate();
        this.title = items.getTitle();
        this.deviceType = items.getDeviceType();
        this.description = items.getDescription();
        this.price = items.getPrice();
        this.phoneNumber = items.getPhoneNumber();
        this.itemCondition = items.getItemCondition();
        this.status =items.isStatus();
        this.place = items.getPlace();
        this.itemPhoto1 = itemPhoto1;
        this.itemPhoto2 = itemPhoto2;
        this.itemPhoto3 = itemPhoto3;
        this.model = items.getModel();
        this.lastModifyDate = items.getLastModifyDate();

    }
}

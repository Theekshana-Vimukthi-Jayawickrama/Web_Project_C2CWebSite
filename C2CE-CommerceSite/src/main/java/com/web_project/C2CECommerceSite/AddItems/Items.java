package com.web_project.C2CECommerceSite.AddItems;

import com.web_project.C2CECommerceSite.user.User;
import jakarta.persistence.*;
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
@Table(name = "ItemsToSell")
public class Items {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
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
    private UUID adminId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinTable(name ="items_photo1", joinColumns = {@JoinColumn(name = "fk_items")},
            inverseJoinColumns = {@JoinColumn(name = "fk_photo1")})
    private ItemPhoto1 itemPhoto1;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinTable(name ="items_photo2", joinColumns = {@JoinColumn(name = "fk_items")},
            inverseJoinColumns = {@JoinColumn(name = "fk_photo2")})
    private ItemPhoto2 itemPhoto2;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinTable(name ="items_photo3", joinColumns = {@JoinColumn(name = "fk_items")},
            inverseJoinColumns = {@JoinColumn(name = "fk_photo3")})
    private ItemPhoto3 itemPhoto3;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

}

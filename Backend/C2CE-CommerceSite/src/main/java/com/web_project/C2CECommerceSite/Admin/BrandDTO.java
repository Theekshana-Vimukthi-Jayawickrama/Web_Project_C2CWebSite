package com.web_project.C2CECommerceSite.Admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BrandDTO {
    private String brand;
    private long id;

    public BrandDTO(Brand brands) {

        this.brand = brands.getBrand();
        this.id = brands.getId();
    }
}

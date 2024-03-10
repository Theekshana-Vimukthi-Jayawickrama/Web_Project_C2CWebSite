package com.web_project.C2CECommerceSite.Admin;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class SliderAds {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String photoType;
    private UUID adminId;
    @Lob
    @Column(name = "Data", columnDefinition = "LONGBLOB" )
    private byte[] data;
}

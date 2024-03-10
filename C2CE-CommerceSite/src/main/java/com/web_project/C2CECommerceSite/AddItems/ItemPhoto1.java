package com.web_project.C2CECommerceSite.AddItems;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ItemPhoto1 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String photoType;
    @Lob
    @Column(name = "Data", columnDefinition = "LONGBLOB" )
    private byte[] data;


}

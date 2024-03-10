package com.web_project.C2CECommerceSite.AddItems;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeleteItemRequest {
    private String reason;
    private UUID userId;
}

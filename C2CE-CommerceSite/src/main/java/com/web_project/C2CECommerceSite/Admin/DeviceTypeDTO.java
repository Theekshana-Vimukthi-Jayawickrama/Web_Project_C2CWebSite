package com.web_project.C2CECommerceSite.Admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceTypeDTO {
    private String deviceType;

    public DeviceTypeDTO(DeviceType deviceTypes) {
        this.deviceType = deviceTypes.getDeviceType().trim().toLowerCase();
    }
}

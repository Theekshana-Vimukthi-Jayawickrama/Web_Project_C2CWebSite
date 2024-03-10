package com.web_project.C2CECommerceSite.Admin;

import com.web_project.C2CECommerceSite.AddItems.ItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/admin/items")
public class itemController {
    private final AdminService adminService;
    @GetMapping("/getDeviceType")
    public ResponseEntity<List<DeviceTypeDTO>> getIDeviceTypes() {
        List<DeviceTypeDTO> deviceType = adminService.getDeviceTypes();
        return new ResponseEntity<>(deviceType, HttpStatus.OK);
    }

    @PostMapping("/addDeviceType")
    public ResponseEntity<?> addDeviceTypes(
            @RequestBody DeviceTypeDTO deviceTypeDTO
    ){
        if(adminService.addDeviceType(deviceTypeDTO)){
            return ResponseEntity.ok("DeviceType created successfully");

        }else{
            return ResponseEntity.badRequest().body("unsuccessful");
        }
    }


    @GetMapping("/getBrands")
    public ResponseEntity<List<BrandDTO>> getBrandNames() {
        List<BrandDTO> brand = adminService.getBrands();
        return new ResponseEntity<>(brand, HttpStatus.OK);
    }

    @PostMapping("/addBrands")
    public ResponseEntity<?> addBrands(
            @RequestBody BrandDTO brandDTO
    ){
        if(adminService.addBrands(brandDTO)){
            return ResponseEntity.ok("DeviceType created successfully");

        }else{
            return ResponseEntity.badRequest().body("unsuccessful");
        }
    }

}

package com.web_project.C2CECommerceSite.Admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web_project.C2CECommerceSite.AddItems.ItemResponse;
import com.web_project.C2CECommerceSite.auth.AuthenticationResponse;
import com.web_project.C2CECommerceSite.auth.RegisterRequest;
import com.web_project.C2CECommerceSite.config.JwtService;
import com.web_project.C2CECommerceSite.user.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/admin/items")
public class itemController {
    private final AdminService adminService;
    private  final ObjectMapper mapperAdult;

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

    @DeleteMapping("/deleteDevice/{id}")
    public ResponseEntity<?> deleteSchoolDistrict(@RequestBody DeviceRequestDelete deviceName,@PathVariable long id) {

        boolean status = adminService.deleteDevice(deviceName,id);
        try {
            if (status) {
                return ResponseEntity.ok("Deleted");
            } else {
                return ResponseEntity.badRequest().body("Already deleted");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getAllRemoveDevices")
    public ResponseEntity<List<DeviceRequestDelete>> getAllRemoveDevice (){

        try {
            List<DeviceRequestDelete> devices = adminService.getAllDeleteDevice();

            if(devices == null){
                return ResponseEntity.notFound().build();
            }else{
                return ResponseEntity.ok(devices);
            }
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }



    @PutMapping("/updateDevice/{id}")
    public ResponseEntity<?> updateDevices(@RequestBody DeviceRequest deviceName, @PathVariable long id) {

        boolean status = adminService.updateDevice(deviceName, id);
        try {
            if (status) {
                return ResponseEntity.ok("Updated");
            } else {
                return ResponseEntity.badRequest().body("Already updated");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
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

    @DeleteMapping("/deleteBrand/{id}")
    public ResponseEntity<?> deleteBrand(@RequestBody BrandsRequestDelete brandName,@PathVariable long id) {

        boolean status = adminService.deleteBrand(brandName,id);
        try {
            if (status) {
                return ResponseEntity.ok("Deleted");
            } else {
                return ResponseEntity.badRequest().body("Already deleted");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PutMapping("/updateBrand/{id}")
    public ResponseEntity<?> updateBrands(@RequestBody BrandRequest brandName, @PathVariable long id) {

        boolean status = adminService.updateBrand(brandName, id);
        try {
            if (status) {
                return ResponseEntity.ok("Updated");
            } else {
                return ResponseEntity.badRequest().body("Already updated");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getAllRemoveBrands")
    public ResponseEntity<List<BrandsRequestDelete>> getAllRemoveBrands (){

        try {
            List<BrandsRequestDelete> brands = adminService.getAllDeleteBrands();

            if(brands == null){
                return ResponseEntity.notFound().build();
            }else{
                return ResponseEntity.ok(brands);
            }
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }



}

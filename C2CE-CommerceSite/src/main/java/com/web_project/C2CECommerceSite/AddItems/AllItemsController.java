package com.web_project.C2CECommerceSite.AddItems;

import com.web_project.C2CECommerceSite.Admin.AdminService;
import com.web_project.C2CECommerceSite.Admin.DeviceTypeDTO;
import com.web_project.C2CECommerceSite.Admin.SliderPhotoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/allItems")
public class AllItemsController {
    private final AdminService adminService;
    @Autowired
    private final ItemsService itemsService;
    @GetMapping("/getItem/{itemId}")
    public ResponseEntity<ItemResponse> getItemsWithPhotosByItemId(@PathVariable Long itemId) {
        ItemResponse itemWithPhotosList = itemsService.getItemsWithPhotosByItemId(itemId);
        return new ResponseEntity<>(itemWithPhotosList, HttpStatus.OK);
    }
    @GetMapping("/getAllItems")
    public ResponseEntity<List<ItemResponse>> getItemsWithPhotosByUserId() {
        List<ItemResponse> itemsWithPhotosList = itemsService.getAllItems();
        return new ResponseEntity<>(itemsWithPhotosList, HttpStatus.OK);
    }
    @GetMapping("/getSliderPhoto")
    public ResponseEntity<List<SliderPhotoResponse>> getSliderPhoto(

    ) throws IOException {
        try{
            List<SliderPhotoResponse> slider =  adminService.getSliderPhotos();
            return ResponseEntity.ok(slider);
        }catch (Exception e){
            return (ResponseEntity<List<SliderPhotoResponse>>) ResponseEntity.notFound();

        }
    }
    @GetMapping("/getDeviceType")
    public ResponseEntity<List<DeviceTypeDTO>> getIDeviceTypes() {
        List<DeviceTypeDTO> deviceType = itemsService.getDeviceTypes();
        return new ResponseEntity<>(deviceType, HttpStatus.OK);
    }
}

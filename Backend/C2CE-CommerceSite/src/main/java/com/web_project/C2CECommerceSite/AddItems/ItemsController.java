package com.web_project.C2CECommerceSite.AddItems;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web_project.C2CECommerceSite.Admin.BrandDTO;
import com.web_project.C2CECommerceSite.Admin.DeviceTypeDTO;
import com.web_project.C2CECommerceSite.user.GetUserNameDTO;
import com.web_project.C2CECommerceSite.user.GetUserNameRequest;
import com.web_project.C2CECommerceSite.user.User;
import com.web_project.C2CECommerceSite.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/item")
public class ItemsController {
    @Autowired
    private final ItemsService itemsService;

    private final ObjectMapper mapper;
    @PostMapping("/{userId}/items/add")
    public ResponseEntity<String> addItemWithPhotos(
            @PathVariable String userId,
            @RequestPart("itemDetails") String items,
            @RequestParam(value = "itemPhoto1", required = true)MultipartFile photo1,
            @RequestParam(value = "itemPhoto2", required = false)MultipartFile photo2,
            @RequestParam(value = "itemPhoto3", required = false)MultipartFile photo3
            ) throws JsonProcessingException {
        ItemsRequest itemsRequest = mapper.readValue(items, ItemsRequest.class);
        try {
            itemsService.saveItemData(photo1,photo2,photo3,itemsRequest,userId);
            return new ResponseEntity<>("Item and photos saved successfully", HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Error saving item and photos: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/getItem/{itemId}")
    public ResponseEntity <ItemResponse> getItemsWithPhotosByItemId(@PathVariable Long itemId) {
        ItemResponse itemWithPhotosList = itemsService.getItemsWithPhotosByItemId(itemId);
        return new ResponseEntity<>(itemWithPhotosList, HttpStatus.OK);
    }
    @GetMapping("/seller/{userId}")
    public ResponseEntity<List<ItemResponse>> getItemsWithPhotosByUserId(@PathVariable String userId) {
        List<ItemResponse> itemsWithPhotosList = itemsService.getItemsWithPhotosByUserId(userId);
        return new ResponseEntity<>(itemsWithPhotosList, HttpStatus.OK);
    }


    @GetMapping("/getBrands")
    public ResponseEntity<List<BrandDTO>> getBrandNames() {
        List<BrandDTO> brand = itemsService.getBrands();
        return new ResponseEntity<>(brand, HttpStatus.OK);
    }

    @GetMapping("/getDeviceType")
    public ResponseEntity<List<DeviceTypeDTO>> getIDeviceTypes() {
        List<DeviceTypeDTO> deviceType = itemsService.getDeviceTypes();
        return new ResponseEntity<>(deviceType, HttpStatus.OK);
    }


    @PutMapping("/modifyItem/{itemId}")
    public ResponseEntity<String> upgradeItem(
            @PathVariable Long itemId,
            @RequestPart("itemDetails") String items,
            @RequestParam(value = "itemPhoto1", required = false)MultipartFile photo1,
            @RequestParam(value = "itemPhoto2", required = false)MultipartFile photo2,
            @RequestParam(value = "itemPhoto3", required = false)MultipartFile photo3
    ) throws IOException {
        ItemsRequest itemsRequest = mapper.readValue(items, ItemsRequest.class);
        if(itemsService.upgradeItemById(itemId, photo1,photo2,photo3,itemsRequest)){
            return ResponseEntity.ok("Successfully upgrade.");
        }
            return new ResponseEntity<>("Unsuccessfully to upgrade", HttpStatus.BAD_REQUEST);

    }

    @DeleteMapping("/deleteItem/{itemId}")
    public  ResponseEntity<String> deleteItem(@PathVariable Long itemId, @RequestBody DeleteItemRequest deleteItemRequest) {
        if(itemsService.deleteItemById(itemId,deleteItemRequest)){
            return ResponseEntity.ok("Successfully deleted");
        }else{
            return new ResponseEntity<>("Unsuccessfully to delete", HttpStatus.BAD_REQUEST);
        }
    }



}

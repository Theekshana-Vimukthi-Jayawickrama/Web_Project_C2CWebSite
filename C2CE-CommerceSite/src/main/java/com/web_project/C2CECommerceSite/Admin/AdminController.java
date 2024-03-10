package com.web_project.C2CECommerceSite.Admin;

import com.web_project.C2CECommerceSite.AddItems.DeleteItemRequest;
import com.web_project.C2CECommerceSite.AddItems.ItemResponse;
import com.web_project.C2CECommerceSite.AddItems.ItemsService;
import com.web_project.C2CECommerceSite.auth.AuthenticationRequest;
import com.web_project.C2CECommerceSite.auth.AuthenticationResponse;
import com.web_project.C2CECommerceSite.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService service;
    private final ItemsService itemsService;
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PutMapping("/activeItem")
    public ResponseEntity<?> authenticate(
            @RequestBody ActiveItemRequest request
    ){
        return ResponseEntity.ok(service.activeItem(request));
    }

    @GetMapping("/getItem/{itemId}")
    public ResponseEntity<ItemResponse> getItemsWithPhotosByItemId(@PathVariable Long itemId) {
        ItemResponse itemWithPhotosList = service.getItemsWithPhotosByItemId(itemId);
        return new ResponseEntity<>(itemWithPhotosList, HttpStatus.OK);
    }
    @GetMapping("/getAllItems")
    public ResponseEntity<List<ItemResponse>> getItemsWithPhotosByUserId() {
        List<ItemResponse> itemsWithPhotosList = itemsService.getAllItemsForAdmin();
        return new ResponseEntity<>(itemsWithPhotosList, HttpStatus.OK);
    }

    @GetMapping("/getAllPendingItems")
    public ResponseEntity<List<ItemResponse>> getAllPendingItems() {
        List<ItemResponse> itemsWithPhotosList = itemsService.getAllPendingItemsForAdmin();
        return new ResponseEntity<>(itemsWithPhotosList, HttpStatus.OK);
    }

    @DeleteMapping("/deleteItem/{itemId}")
    public  ResponseEntity<String> deleteItem(@PathVariable Long itemId, @RequestBody DeleteItemRequest deleteItemRequest) {
        if(service.deleteItemById(itemId,deleteItemRequest)){
            return ResponseEntity.ok("Successfully deleted");
        }else{
            return new ResponseEntity<>("Unsuccessfully to delete", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/addSliderPhoto/{adminId}")
    public ResponseEntity<String> addSliderPhoto(
            @PathVariable UUID adminId,
            @RequestParam(value = "AdsPhoto") MultipartFile photo
    ) throws IOException {
        if(service.addAdsPhotos( photo, adminId)){
            return ResponseEntity.ok("Successfully added.");
        }
        return new ResponseEntity<>("Unsuccessfully to add", HttpStatus.BAD_REQUEST);

    }

    @PutMapping("/updateSliderPhoto/{adminId}/{itemId}")
    public ResponseEntity<String> updateSliderPhoto(
            @PathVariable UUID adminId,
            @RequestParam(value = "AdsPhoto") MultipartFile photo,
            @PathVariable long itemId
    ) throws IOException {
        if(service.updateSliderPhoto( photo,itemId, adminId)){
            return ResponseEntity.ok("Successfully upgrade.");
        }
        return new ResponseEntity<>("Unsuccessfully to upgrade", HttpStatus.BAD_REQUEST);

    }

    @DeleteMapping("/deleteSliderPhoto/{itemId}/{adminId}")
    public ResponseEntity<String> RemoveSliderPhoto(
            @PathVariable Long itemId,
            @PathVariable UUID adminId
    ) throws IOException {
        if(service.removeAdsPhotos(itemId,adminId)){
            return ResponseEntity.ok("Successfully remove.");
        }
        return new ResponseEntity<>("Unsuccessfully to remove", HttpStatus.BAD_REQUEST);

    }

    @GetMapping("/getSliderPhoto")
    public ResponseEntity<List<SliderPhotoResponse>> getSliderPhoto(

    ) throws IOException {
        try{
            List<SliderPhotoResponse> slider =  service.getSliderPhotos();
            return ResponseEntity.ok(slider);
        }catch (Exception e){
            return (ResponseEntity<List<SliderPhotoResponse>>) ResponseEntity.notFound();

        }
    }

    @GetMapping("/getAllUsers")
    public  ResponseEntity<List<UserResponse>> getAllSellers(){
        try{
        List<UserResponse> response =  service.getAllUser();
            return ResponseEntity.ok(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}

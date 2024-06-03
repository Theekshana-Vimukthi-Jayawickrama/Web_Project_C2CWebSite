package com.web_project.C2CECommerceSite.Admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web_project.C2CECommerceSite.AddItems.DeleteItemRequest;
import com.web_project.C2CECommerceSite.AddItems.ItemResponse;
import com.web_project.C2CECommerceSite.AddItems.ItemsService;
import com.web_project.C2CECommerceSite.auth.AuthenticationRequest;
import com.web_project.C2CECommerceSite.auth.AuthenticationResponse;
import com.web_project.C2CECommerceSite.auth.RegisterRequest;
import com.web_project.C2CECommerceSite.user.GetShortAdminDetailsResponse;
import com.web_project.C2CECommerceSite.user.User;
import com.web_project.C2CECommerceSite.user.UserRepo;
import com.web_project.C2CECommerceSite.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService service;
    private final ItemsService itemsService;
    private  final ObjectMapper mapperAdult;
    @Autowired
    private final UserRepo userRepo;
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

    @DeleteMapping("/removeUser/{userId}/{adminId}")
    public ResponseEntity<?> removeUsers(
            @PathVariable UUID userId,
            @PathVariable UUID adminId,
            @RequestBody UserDeleteRequest userDeleteRequest
    ) {

        try {
            if (service.removeUser(userId,adminId,userDeleteRequest)) {
                return ResponseEntity.ok("Successful");
            } else {
                return ResponseEntity.badRequest().body("Unsuccessful");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register" )
    public ResponseEntity<AuthenticationResponse> aminRegister(
            @RequestPart("request") String request1
    ) throws JsonProcessingException {

        try {
            RegisterRequest userRequest = mapperAdult.readValue(request1, RegisterRequest.class);
            Optional<User> user = userRepo.findByEmail(userRequest.getEmail());
            if(user.isPresent()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }else{
                AuthenticationResponse response = service.adminRegister(userRequest);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/getAdminShortDetails")
    public ResponseEntity<List<GetShortAdminDetailsResponse>> getAdminShortDetails(){
        try {
            return ResponseEntity.ok(service.getAdminShortDetails());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
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

    @GetMapping("/getAdminAllDetails/{userId}")
    public ResponseEntity<GetAllAdminDetailsResponse> getAdminAllDetails(@PathVariable UUID userId){

        try {
            GetAllAdminDetailsResponse user = service.getAdminAllDetails(userId);

            return ResponseEntity.ok(user);

        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/updateAdminDetails/{userId}")
    public ResponseEntity<Boolean> updateAdminDetails(@PathVariable UUID userId,
                                                      @RequestPart("request") String getAllConductorDetailsResponse
                                                     ){
        try {
            GetAllAdminDetailsResponse getAllConductorDetailsResponse1 = mapperAdult.readValue(getAllConductorDetailsResponse,GetAllAdminDetailsResponse.class);
            return ResponseEntity.ok(service.UpdateAdminDetails(userId, getAllConductorDetailsResponse1));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}

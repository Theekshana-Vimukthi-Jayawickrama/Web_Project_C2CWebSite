package com.web_project.C2CECommerceSite.AddItems;

import com.web_project.C2CECommerceSite.Admin.*;
import com.web_project.C2CECommerceSite.user.GetUserNameDTO;
import com.web_project.C2CECommerceSite.user.GetUserNameRequest;
import com.web_project.C2CECommerceSite.user.User;
import com.web_project.C2CECommerceSite.user.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@Service
@CrossOrigin
@RequiredArgsConstructor
public class ItemsService {
    @Autowired
    private final ItemsRepository itemsRepository;
    @Autowired
    private final UserRepo userRepository;
    @Autowired
    private final BrandRepository brandRepository;
    @Autowired
    private final DeviceTypeRepository deviceTypeRepository;
    @Autowired
    private final DeleteItemRepository deleteItemRepository;
    public void saveItemData(MultipartFile photo1,MultipartFile photo2,MultipartFile photo3,ItemsRequest items,String userId){
        UUID sellerId = UUID.fromString(userId);
        Optional<User> user = userRepository.findById(sellerId);
        Items itemsDetails = Items.builder()
                .brand(items.getBrand())
                .place(items.getPlace())
                .price(items.getPrice())
                .title(items.getTitle())
                .model(items.getModel())
                .description(items.getDescription())
                .itemCondition(items.getItemCondition())
                .phoneNumber(items.getPhoneNumber())
                .deviceType(items.getDeviceType())
                .price(items.getPrice())
                .status(false)
                .postAddedDate(LocalDate.now())
                .seller(user.get())
                .build();

        try {
            ItemPhoto1 photo = new ItemPhoto1();
            photo.setName(photo1.getOriginalFilename());
            photo.setData(photo1.getBytes());
            photo.setPhotoType(photo1.getContentType());
            itemsDetails.setItemPhoto1(photo);

        }catch (Exception e){
            e.printStackTrace();
        }

        try {
            ItemPhoto2 photo = new ItemPhoto2();
            photo.setName(photo2.getOriginalFilename());
            photo.setData(photo2.getBytes());
            photo.setPhotoType(photo2.getContentType());
            itemsDetails.setItemPhoto2(photo);

        }catch (Exception e){
            e.printStackTrace();
        }

        try {
            ItemPhoto3 photo = new ItemPhoto3();
            photo.setName(photo3.getOriginalFilename());
            photo.setData(photo3.getBytes());
            photo.setPhotoType(photo3.getContentType());
            itemsDetails.setItemPhoto3(photo);

        }catch (Exception e){
            e.printStackTrace();
        }

        itemsRepository.save(itemsDetails);

    }

    public List<BrandDTO> getBrands() {
        List<Brand> brand = brandRepository.findAll();
        List<BrandDTO> brandsDTO = new ArrayList<>();
        for(Brand brands : brand){
            BrandDTO brandDTO = new BrandDTO(brands);
            brandsDTO.add(brandDTO);
        }
        return brandsDTO;
    }

    public List<ItemResponse> getAllItemsForAdmin() {
        List<Items> items = itemsRepository.findAll();
        List<ItemResponse> itemsWithPhotosList = new ArrayList<>();

        for (Items item : items) {
            ItemPhoto1 itemPhoto1 = item.getItemPhoto1();
            ItemPhoto2 itemPhoto2 = item.getItemPhoto2();
            ItemPhoto3 itemPhoto3 = item.getItemPhoto3();
            ItemResponse itemWithPhotosDTO = new ItemResponse(item, itemPhoto1, itemPhoto2, itemPhoto3);
            itemsWithPhotosList.add(itemWithPhotosDTO);
        }
        return itemsWithPhotosList;
    }

    public List<ItemResponse> getAllPendingItemsForAdmin() {
        List<Items> items = itemsRepository.findAll();
        List<ItemResponse> itemsWithPhotosList = new ArrayList<>();

        for (Items item : items) {
            if(!item.isStatus()){
                ItemPhoto1 itemPhoto1 = item.getItemPhoto1();
                ItemPhoto2 itemPhoto2 = item.getItemPhoto2();
                ItemPhoto3 itemPhoto3 = item.getItemPhoto3();
                ItemResponse itemWithPhotosDTO = new ItemResponse(item, itemPhoto1, itemPhoto2, itemPhoto3);
                itemsWithPhotosList.add(itemWithPhotosDTO);
            }
        }
        return itemsWithPhotosList;
    }
    public List<DeviceTypeDTO> getDeviceTypes() {
        List<DeviceType> deviceType = deviceTypeRepository.findAll();
        List<DeviceTypeDTO> deviceTypeDTO = new ArrayList<>();
        for(DeviceType deviceTypes : deviceType){
            DeviceTypeDTO deviceTypeDTO1 = new DeviceTypeDTO(deviceTypes);
            deviceTypeDTO.add(deviceTypeDTO1);
        }
        return deviceTypeDTO;
    }


    public List<Items> getAllItemsForUser(String id) {
        UUID userId = UUID.fromString(id);
        Optional<User> user = userRepository.findById(userId);
        if (user != null) {

            return itemsRepository.findBySellerId(userId);
        } else {
            // Handle user not found
            return Collections.emptyList();
        }
    }
        public List<ItemResponse> getItemsWithPhotosByUserId(String id) {
            UUID userId = UUID.fromString(id);
            List<Items> items = itemsRepository.findBySellerId(userId);
            List<ItemResponse> itemsWithPhotosList = new ArrayList<>();

            for (Items item : items) {
                ItemPhoto1 itemPhoto1 = item.getItemPhoto1();
                ItemPhoto2 itemPhoto2 = item.getItemPhoto2();
                ItemPhoto3 itemPhoto3 = item.getItemPhoto3();
                ItemResponse itemWithPhotosDTO = new ItemResponse(item, itemPhoto1, itemPhoto2, itemPhoto3);
                itemsWithPhotosList.add(itemWithPhotosDTO);
            }

            return itemsWithPhotosList;
        }


    public ItemResponse getItemsWithPhotosByItemId(Long itemId) {

        Optional<Items> item = itemsRepository.findById(itemId);

        if(item.isPresent()){
            Items itemDetails = item.get();
            ItemPhoto1 itemPhoto1 = item.get().getItemPhoto1();
            ItemPhoto2 itemPhoto2 = item.get().getItemPhoto2();
            ItemPhoto3 itemPhoto3 = item.get().getItemPhoto3();
            return new ItemResponse(itemDetails, itemPhoto1, itemPhoto2, itemPhoto3);
        }else {
            return null;
        }

    }

    public List<ItemResponse> getAllItems() {
        List<Items> items = itemsRepository.findAll();
        List<ItemResponse> itemsWithPhotosList = new ArrayList<>();

        for (Items item : items) {
            if(item.isStatus()){
                ItemPhoto1 itemPhoto1 = item.getItemPhoto1();
                ItemPhoto2 itemPhoto2 = item.getItemPhoto2();
                ItemPhoto3 itemPhoto3 = item.getItemPhoto3();
                ItemResponse itemWithPhotosDTO = new ItemResponse(item, itemPhoto1, itemPhoto2, itemPhoto3);
                itemsWithPhotosList.add(itemWithPhotosDTO);
            }
        }
        return itemsWithPhotosList;
    }



    public boolean upgradeItemById(Long itemId, MultipartFile photo1, MultipartFile photo2, MultipartFile photo3, ItemsRequest itemsRequest) throws IOException {
        Optional<Items> item = itemsRepository.findById(itemId);
        if(item.isPresent()){
            if(photo1 != null){
                ItemPhoto1 photo = new ItemPhoto1();
                photo.setName(photo1.getOriginalFilename());
                photo.setData(photo1.getBytes());
                photo.setPhotoType(photo1.getContentType());
                item.get().setItemPhoto1(photo);
            }
            if(photo2 != null){
                ItemPhoto2 photo = new ItemPhoto2();
                photo.setName(photo2.getOriginalFilename());
                photo.setData(photo2.getBytes());
                photo.setPhotoType(photo2.getContentType());
                item.get().setItemPhoto2(photo);
            }
            if(photo3 != null){
                ItemPhoto3 photo = new ItemPhoto3();
                photo.setName(photo3.getOriginalFilename());
                photo.setData(photo3.getBytes());
                photo.setPhotoType(photo3.getContentType());
                item.get().setItemPhoto3(photo);
            }
            item.get().setItemCondition(itemsRequest.getItemCondition());
            item.get().setBrand(itemsRequest.getBrand());
            item.get().setDescription(itemsRequest.getDescription());
            item.get().setDeviceType(itemsRequest.getDeviceType());
            item.get().setModel(itemsRequest.getModel());
            item.get().setPhoneNumber(itemsRequest.getPhoneNumber());
            item.get().setPlace(itemsRequest.getPlace());
            item.get().setTitle(itemsRequest.getTitle());
            item.get().setLastModifyDate(LocalDate.now());

            itemsRepository.save(item.get());
            return true;

        }else{
            return false;
        }
    }

    public boolean deleteItemById(Long itemId, DeleteItemRequest deleteItemRequest) {
        Optional<Items> item = itemsRepository.findById(itemId);
        if(item.isPresent()){
            DeleteItem deleteItem = DeleteItem.builder()
                    .deleteItemId(item.get().getId())
                    .phoneNumber(item.get().getPhoneNumber())
                    .postAddedDate(item.get().getPostAddedDate())
                    .itemCondition(item.get().getItemCondition())
                    .place(item.get().getPlace())
                    .price(item.get().getPrice())
                    .title(item.get().getTitle())
                    .model(item.get().getModel())
                    .description(item.get().getDescription())
                    .lastModifyDate(item.get().getLastModifyDate())
                    .deviceType(item.get().getDeviceType())
                    .status(item.get().isStatus())
                    .adsRemoveUserId(deleteItemRequest.getUserId())
                    .reason(deleteItemRequest.getReason())
                    .deletedBy("Seller")
                    .userId(item.get().getSeller().getId())
                    .build();
            deleteItemRepository.save(deleteItem);
            itemsRepository.deleteById(itemId);
            return true;
        }else{
            throw new RuntimeException("Item not found with id: " + itemId);
        }
    }
}

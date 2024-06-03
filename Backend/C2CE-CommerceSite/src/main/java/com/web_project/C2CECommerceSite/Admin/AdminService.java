package com.web_project.C2CECommerceSite.Admin;

import com.web_project.C2CECommerceSite.AddItems.*;
import com.web_project.C2CECommerceSite.auth.AuthenticationRequest;
import com.web_project.C2CECommerceSite.auth.AuthenticationResponse;
import com.web_project.C2CECommerceSite.auth.RegisterRequest;
import com.web_project.C2CECommerceSite.config.JwtService;
import com.web_project.C2CECommerceSite.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
@Autowired
private final DeviceTypeRepository deviceTypeRepository;
@Autowired
private final BrandRepository brandRepository;
 @Autowired
 private final UserRepo repository;
 private final JavaMailSender emailSender;
 private final AuthenticationManager authenticationManager;
 @Autowired
 private  final ItemsRepository itemsRepository;
 private final DeleteItemRepository deleteItemRepository;
 private final SliderAdsRepository sliderAdsRepository;
 private  final DeleteUserRepository deleteUserRepository;
 private final DeleteDeviceRepo deleteDeviceRepo;
 private final BrandDeleteRepo brandDeleteRepo;
 private final PasswordEncoder passwordEncoder;
 private final RoleRepository roleRepository;
    public boolean addDeviceType(DeviceTypeDTO deviceTypeDTO) {
        if(deviceTypeDTO.getDeviceType() != null){
            DeviceType deviceType = DeviceType.builder()
                    .deviceType(deviceTypeDTO.getDeviceType().toUpperCase().trim())
                    .build();
            deviceTypeRepository.save(deviceType);
            return true;
        }else{
            return false;
        }
    }

    public GetAllAdminDetailsResponse getAdminAllDetails(UUID userId) {
        Optional<User> user = repository.findById(userId);
        if (user.isPresent()) {

            List<String> userRoles = user.get().getRoles().stream()
                    .map(role -> role.getName().toString())
                    .toList();
            System.out.println(userRoles);
            if(userRoles.contains(Role.ADMIN.toString().toUpperCase().trim())){

                return GetAllAdminDetailsResponse.builder()
                        .fullName(user.get().getUserPersonalDetails().getFullName() != null ? user.get().getUserPersonalDetails().getFullName() : "null")
                        .nickName(user.get().getUserPersonalDetails().getNickName() != null ? user.get().getUserPersonalDetails().getNickName() : "null")
                        .dob(user.get().getUserPersonalDetails().getDob() != null ? user.get().getUserPersonalDetails().getDob() : "null")
                        .address(user.get().getUserPersonalDetails().getAddress() != null ? user.get().getUserPersonalDetails().getAddress() : "null")
                        .gender(user.get().getUserPersonalDetails().getGender() != null ? user.get().getUserPersonalDetails().getGender() : "null")
                        .telephoneNumber(user.get().getUserPersonalDetails().getTelephone() != null  ? user.get().getUserPersonalDetails().getTelephone() : "null")
                        .role(Role.ADMIN.toString())
                        .id(user.get().getUsername())
                        .email(user.get().getEmail())
                        .build();

            }
        }
        return null;
    }

    public AuthenticationResponse adminRegister(RegisterRequest request) throws Exception {


        UserPersonalDetails personalDetails = UserPersonalDetails.builder()
                .dob(request.getDob())
                .telephone(request.getTelephone())
                .gender(request.getGender())
                .fullName(request.getFullName())
                .nickName(request.getNickName())
                .address(request.getAddress())
                .build();
        Set<UserRole> roles = new HashSet<>();
        roles.add(roleRepository.findByName(Role.ADMIN).orElseThrow(() -> new IllegalArgumentException("Role not Found")));

        SuperAdminStatusMaintain superAdminMaintain = SuperAdminStatusMaintain.builder()
                .status(false)
                .build();

        var user = User.builder()
                .email(request.getEmail())
                .userPersonalDetails(personalDetails)
                .superAdminMaintain(superAdminMaintain)
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .build();

        repository.save(user);
        var jwtToken = JwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .build();
    }

    public List<GetShortAdminDetailsResponse> getAdminShortDetails() {
        List<User> users = repository.findAll();
        if (users.isEmpty()) {
            return null;
        } else {
            List<GetShortAdminDetailsResponse> userName = new ArrayList<GetShortAdminDetailsResponse>();

            for (User user : users) {
                List<String> userRoles = user.getRoles().stream()
                        .map(role -> role.getName().toString())
                        .collect(Collectors.toList());
                if(userRoles.contains(Role.ADMIN.toString().toUpperCase().trim())){

                    GetShortAdminDetailsResponse getShortAdminDetailsResponse = GetShortAdminDetailsResponse.builder()
                            .userName(user.getUsername())
                            .fullName(user.getUserPersonalDetails().getFullName().toString())
                            .role(Role.ADMIN.toString())
                            .status(user.getSuperAdminMaintain().isStatus())
                            .id(user.getId())
                            .build();

                    userName.add(getShortAdminDetailsResponse);

                }
            }
            return userName;
        }
    }

    public boolean updateDevice(DeviceRequest deviceName, long id) {
        String newDevice = deviceName.getDeviceName().toUpperCase().trim();
        Optional<DeviceType> device = deviceTypeRepository.findById(id);
        if (device.isPresent()) {
            device.get().setDeviceType(deviceName.getDeviceName().toUpperCase().trim());
            deviceTypeRepository.save(device.get());
            return true;
        } else {
            return false;

        }
    }

    public boolean updateBrand(BrandRequest deviceName, long id) {
        String newDevice = deviceName.getBrand().toUpperCase().trim();
        Optional<Brand> device = brandRepository.findById(id);
        if (device.isPresent()) {
            device.get().setBrand(deviceName.getBrand().toUpperCase().trim());
            brandRepository.save(device.get());
            return true;
        } else {
            return false;

        }
    }

    public boolean deleteDevice(DeviceRequestDelete deviceName, long id) {

        Optional<DeviceType> device = deviceTypeRepository.findById(id);
        if (device.isPresent() ) {
            DeleteDeviceName deleteDeviceName = DeleteDeviceName.builder()
                    .adminId(deviceName.getAdminId())
                    .deviceName(device.get().getDeviceType().toUpperCase().trim())
                    .reason(deviceName.getReason())
                    .deleteDate(LocalDate.now())
                    .build();
            deleteDeviceRepo.save(deleteDeviceName);
            deviceTypeRepository.delete(device.get());
            return true;
        } else {
            return false;
        }
    }

    public boolean deleteBrand(BrandsRequestDelete deviceName, long id) {

        Optional<Brand> brand = brandRepository.findById(id);
        if (brand.isPresent()) {
            BrandsDelete deleteDeviceName = BrandsDelete.builder()
                    .adminId(deviceName.getAdminId())
                    .deviceName(brand.get().getBrand().toUpperCase().trim())
                    .reason(deviceName.getReason())
                    .deleteDate(LocalDate.now())
                    .build();
            brandDeleteRepo.save(deleteDeviceName);
            brandRepository.delete(brand.get());
            return true;
        } else {
            return false;
        }
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




    public List<BrandDTO> getBrands() {
        List<Brand> brand = brandRepository.findAll();
        List<BrandDTO> brandsDTO = new ArrayList<>();
        for(Brand brands : brand){
            BrandDTO brandDTO = new BrandDTO(brands);
            brandsDTO.add(brandDTO);
        }
        return brandsDTO;
    }

    public boolean addBrands(BrandDTO brandDTO) {
        if(brandDTO.getBrand() != null){
            Brand brands = Brand.builder()
                    .brand(brandDTO.getBrand().trim().toUpperCase())
                    .build();
            brandRepository.save(brands);
            return true;
        }else{
            return false;
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();

//        if(user.getRoles().stream().anyMatch(role -> role.getName().equals(Role.SELLER))){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        List<String> userRoles = user.getRoles().stream()
                .map(role -> role.getName().toString())
                .collect(Collectors.toList());

        var jwtToken = JwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .role(userRoles)
                .build();
//        }else{
//            return null;
//        }
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

    public boolean activeItem(ActiveItemRequest request) {
        long id = request.getId();
        Optional<Items> item = itemsRepository.findById(id);
        if(item.isPresent()){
            item.get().setStatus(true);
            item.get().setAdminId(request.getAdminId());
            itemsRepository.save(item.get());
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(item.get().getSeller().getEmail());
            message.setSubject("Your Posted Advertisement Has Been Successfully Accepted!");
            message.setText("Dear "+item.get().getSeller().getUserPersonalDetails().getFullName()+",\n" +
                    "\n" +
                    "We are pleased to inform you that your posted advertisement which title is "+item.get().getTitle() +", has been successfully accepted. Thank you for choosing our platform to showcase your ad!\n" +
                    "\n" +
                    "This confirmation signifies that your advertisement has met all the necessary criteria and has been approved for publication. Your ad will now be visible to our audience, maximizing its reach and effectiveness.\n" +
                    "\n" +
                    "Should you have any further questions or require assistance, please don't hesitate to reach out to our support team. We are here to ensure your advertising experience with us is smooth and productive.\n" +
                    "\n" +
                    "Thank you once again for choosing us for your advertising needs. We look forward to seeing the positive impact your advertisement will have.\n" +
                    "\n" +
                    "Best regards,\n" +
                    "[Company/Organization Name]");
            emailSender.send(message);
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
                    .deletedBy("Admin")
                    .userId(item.get().getSeller().getId())
                    .build();
            deleteItemRepository.save(deleteItem);
            itemsRepository.deleteById(itemId);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(item.get().getSeller().getEmail());
            message.setSubject("Your Posted Advertisement Has Been Denied!");
            message.setText("Dear "+item.get().getSeller().getUserPersonalDetails().getFullName()+",\n" +
                    "\n" +
                    "We are pleased to inform you that your posted advertisement which title is "+item.get().getTitle() +", has not been accepted at this time. We understand that this news may be disappointing, and we sincerely apologize for any inconvenience caused.\n" +
                    "\n" +
                    "Our team has carefully reviewed your advertisement against our guidelines, and unfortunately, it does not meet the necessary criteria for acceptance. We want to ensure that all advertisements on our platform align with our standards and objectives.\n" +
                    "\n" +
                    "If you would like further details on why your advertisement was not accepted or if you have any questions, please feel free to reach out to our support team. We are here to assist you and provide guidance on how to improve your advertisement for future submissions.\n" +
                    "\n" +
                    "Thank you for your understanding and cooperation. We appreciate your interest in advertising with us and hope to work with you in the future." +
                    "Best regards,\n" +
                    "[ Company/Organization Name]");
            emailSender.send(message);
            return true;
        }else{
            throw new RuntimeException("Item not found with id: " + itemId);
        }
    }

    public boolean addAdsPhotos(MultipartFile photo, UUID adminId) {
        try {
            SliderAds sliderPhoto = SliderAds.builder()
                    .name(photo.getOriginalFilename())
                    .data(photo.getBytes())
                    .photoType(photo.getContentType())
                    .adminId(adminId)
                    .build();

            sliderAdsRepository.save(sliderPhoto);
            return true;

        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean removeAdsPhotos(long itemId, UUID adminId) {
        try {

            sliderAdsRepository.deleteById(itemId);
            return true;

        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateSliderPhoto(MultipartFile photo3, long id, UUID adminId){
        try {
            SliderAds photo = sliderAdsRepository.findById(id);
            photo.setName(photo3.getOriginalFilename());
            photo.setData(photo3.getBytes());
            photo.setPhotoType(photo3.getContentType());
            sliderAdsRepository.save(photo);
            return true;
        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }

    public List<SliderPhotoResponse> getSliderPhotos() {
        List<SliderAds> sliderPhoto = sliderAdsRepository.findAll();
        List<SliderPhotoResponse> response = new ArrayList<>();
        for(SliderAds ads : sliderPhoto){
            SliderPhotoResponse sliderPhotoResponse = SliderPhotoResponse.builder()
                    .data(ads.getData())
                    .name(ads.getName())
                    .imageId(ads.getId())
                    .photoType(ads.getPhotoType())
                    .build();
            response.add(sliderPhotoResponse);
        }
        return response;
    }

    public List<UserResponse> getAllUser() {
        List<UserResponse> response = new ArrayList<>();
        List<User> users = repository.findAll();

        for (User user : users) {
            if(user.getRoles().stream().anyMatch(role -> role.getName().equals(Role.SELLER))){
            UserPersonalDetails personalDetails = user.getUserPersonalDetails();
            UserResponse.UserResponseBuilder userResponseBuilder = UserResponse.builder()
                    .email(user.getEmail())
                    .userId(user.getId())
                    .role(Role.SELLER.toString());

            if (personalDetails != null) {
                if (personalDetails.getDob() != null) {
                    userResponseBuilder.dob(personalDetails.getDob());
                } else {
                    userResponseBuilder.dob(null);
                }
                if (personalDetails.getAddress() != null) {
                    userResponseBuilder.address(personalDetails.getAddress());
                } else {
                    userResponseBuilder.address(null);
                }
                if (personalDetails.getGender() != null) {
                    userResponseBuilder.gender(personalDetails.getGender());
                } else {
                    userResponseBuilder.gender(null);
                }
                if (personalDetails.getFullName() != null) {
                    userResponseBuilder.fullName(personalDetails.getFullName());
                } else {
                    userResponseBuilder.fullName(null);
                }
                if (personalDetails.getTelephone() != null) {
                    userResponseBuilder.telephone(personalDetails.getTelephone());
                } else {
                    userResponseBuilder.telephone(null);
                }
            } else {
                // If UserPersonalDetails is null, assign null to relevant fields in UserResponse
                userResponseBuilder
                        .dob(null)
                        .address(null)
                        .gender(null)
                        .fullName(null)
                        .telephone(null);
            }

            UserResponse userResponse = userResponseBuilder.build();
            response.add(userResponse);
        }}
        return response;
    }

    public boolean removeUser(UUID userId, UUID adminId, UserDeleteRequest userDeleteRequest) {
        Optional<User> user = repository.findById(userId);
        Optional<User> adminUser = repository.findById(adminId);
        if(adminUser.isPresent()){
            if(user.isPresent()){
                List<String> userRoles = user.get().getRoles().stream()
                        .map(role -> role.getName().toString())
                        .collect(Collectors.toList());
                if(userRoles.contains(userDeleteRequest.getRole().toUpperCase().trim())){
                    LocalDate toDay = LocalDate.now();
                    DeleteUser deleteUser = DeleteUser.builder()
                            .userId(user.get().getId())
                            .userName(user.get().getUsername())
                            .fullName(user.get().getUserPersonalDetails().getFullName())
                            .reason(userDeleteRequest.getReason())
                            .adminId(adminId)
                            .deleteDate(toDay)
                            .role(userDeleteRequest.getRole().toUpperCase().trim())
                            .build();

                    // Update the user (this will update the user_roles table)
                    deleteUserRepository.save(deleteUser);
                    repository.deleteById(userId);
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setTo(user.get().getEmail());
                    message.setSubject("Your account has been removed!");
                    message.setText("Dear "+user.get().getUserPersonalDetails().getFullName()+",\n" +
                            "\n" +
                            " We understand that this news may be disappointing, and we sincerely apologize for any inconvenience caused.\n" +
                            "\n" +
                            "Our team has carefully reviewed your behavior against our guidelines, and unfortunately, it does not meet the necessary criteria for acceptance. Removed account's email is "+ user.get().getEmail() +"."+
                            "\n" +
                            "If you would like further details on why your are was not accepted or if you have any questions, please feel free to reach out to our support team. \n" +
                            "\n" +
                            "Thank you for your understanding and cooperation. " +
                            "Best regards,\n" +
                            "[ Company/E-TIZ]");
                    emailSender.send(message);
                    return true;
                }else{
                    return false;
                }

            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    public List<DeviceRequestDelete> getAllDeleteDevice() {
        List<DeleteDeviceName> deleteDistrictName = deleteDeviceRepo.findAll();
        List<DeviceRequestDelete> districtRequestDelete = new ArrayList<>();

        for(DeleteDeviceName deleteDistrictName1:deleteDistrictName){
            DeviceRequestDelete districtRequestDelete1 = DeviceRequestDelete.builder()
                    .adminId(deleteDistrictName1.getAdminId())
                    .deviceName(deleteDistrictName1.getDeviceName())
                    .reason(deleteDistrictName1.getReason())
                    .date(deleteDistrictName1.getDeleteDate())
                    .build();
            districtRequestDelete.add(districtRequestDelete1);
        }

        return districtRequestDelete;

    }

    public List<BrandsRequestDelete> getAllDeleteBrands() {
        List<BrandsDelete> deleteBrandsName = brandDeleteRepo.findAll();
        List<BrandsRequestDelete> deleteBrandName = new ArrayList<>();

        for(BrandsDelete deleteBrandName1:deleteBrandsName){
            BrandsRequestDelete brandsRequestDelete1 = BrandsRequestDelete.builder()
                    .adminId(deleteBrandName1.getAdminId())
                    .brandName(deleteBrandName1.getDeviceName())
                    .reason(deleteBrandName1.getReason())
                    .date(deleteBrandName1.getDeleteDate())
                    .build();
            deleteBrandName.add(brandsRequestDelete1);
        }

        return deleteBrandName;

    }

    public boolean UpdateAdminDetails(UUID userId, GetAllAdminDetailsResponse getAllConductorDetailsResponse) throws IOException {
        Optional<User> user = repository.findById(userId);
        if (user.isPresent()) {

            List<String> userRoles = user.get().getRoles().stream()
                    .map(role -> role.getName().toString())
                    .toList();
            System.out.println(userRoles);
            if ( userRoles.contains(Role.ADMIN.toString().toUpperCase().trim())) {

                if(!user.get().getUsername().toLowerCase().trim().equals("admin@gmail.com".trim().toLowerCase())){
                    user.get().getUserPersonalDetails().setAddress(getAllConductorDetailsResponse.getAddress());
                    user.get().getUserPersonalDetails().setDob(getAllConductorDetailsResponse.getDob());
                    user.get().getUserPersonalDetails().setGender(getAllConductorDetailsResponse.getGender());
                    user.get().getUserPersonalDetails().setFullName(getAllConductorDetailsResponse.getFullName());
                    user.get().getUserPersonalDetails().setNickName(getAllConductorDetailsResponse.getNickName());
                    user.get().getUserPersonalDetails().setTelephone(getAllConductorDetailsResponse.getTelephoneNumber());

                    repository.save(user.get());
                    return true;
                }

            }
        }
        return false;
    }
}

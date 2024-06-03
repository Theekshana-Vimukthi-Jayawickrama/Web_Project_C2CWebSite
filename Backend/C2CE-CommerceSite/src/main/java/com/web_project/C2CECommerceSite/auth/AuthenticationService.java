package com.web_project.C2CECommerceSite.auth;

import com.web_project.C2CECommerceSite.config.JwtService;
import com.web_project.C2CECommerceSite.user.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
@Data
public class AuthenticationService {

    @Autowired
    private final UserRepo repository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    @Transactional
    public AuthenticationResponse register(RegisterRequest request) throws Exception {

        var seller = UserPersonalDetails.builder()
                .fullName(request.getFullName())
                .nickName(request.getNickName())
                .gender(request.getGender())
                .dob(request.getDob())
                .telephone(request.getTelephone())
                .address(request.getAddress())
                .build();

        Set<UserRole> roles = new HashSet<>();
        roles.add(roleRepository.findByName(Role.SELLER).orElseThrow(() -> new IllegalArgumentException("Role not Found")));

        var user = User.builder()
                .roles(roles)
                .userPersonalDetails(seller)
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        Optional<User> userSaved = repository.findByEmail(request.getEmail().toLowerCase());
        if(userSaved.isPresent()){
            if(userSaved.get().getRoles().stream().anyMatch(role -> role.getName().equals(Role.SELLER))){
                return null;
            }else{
                repository.save(user);
                var jwtToken = JwtService.generateToken(user);
                return AuthenticationResponse.builder()
                        .token(jwtToken)
                        .build();
            }
        }else{
            repository.save(user);
            var jwtToken = JwtService.generateToken(user);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();
        }

    }

    public GetUserNameRequest getSellerName(UUID id) {
        Optional<User> user = repository.findById(id);
        return GetUserNameRequest.builder()
                .name(user.get().getUserPersonalDetails().getNickName())
                .build();

    }

    public boolean changePassword(String userEmail, RequestPassword requestPassword) {
        Optional<User> user = repository.findByEmail(userEmail);
        if(user.isPresent()){
            user.ifPresent(userUpdate ->{
                userUpdate.setPassword( passwordEncoder.encode(requestPassword.getPassword()));
                repository.save(userUpdate);
            });
            return true;
        }else {
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

}



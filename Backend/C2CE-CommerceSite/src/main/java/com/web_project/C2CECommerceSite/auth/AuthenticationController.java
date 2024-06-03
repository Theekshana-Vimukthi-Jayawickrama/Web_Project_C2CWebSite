package com.web_project.C2CECommerceSite.auth;

import com.web_project.C2CECommerceSite.user.GetUserNameRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        try {
            if(service.register(request) == null){
                AuthenticationResponse failureResponse = new AuthenticationResponse("Registration failed", null, null);
                return ResponseEntity.badRequest().body(failureResponse);
            }else{
                return ResponseEntity.ok(service.register(request));
            }

        } catch (Exception e) {
            AuthenticationResponse failureResponse = new AuthenticationResponse("Registration failed", null, null);
            return ResponseEntity.badRequest().body(failureResponse);
        }
    }

    @PutMapping("/updatePassword/{userEmail}")
    public ResponseEntity<Boolean> changePassword(@PathVariable String userEmail,@RequestBody RequestPassword requestPassword){
        boolean status = service.changePassword(userEmail,requestPassword);

        if(status){
            return ResponseEntity.ok(true);
        }else{
            return ResponseEntity.ok(false);
        }
    }


    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/getName/{userId}")
    public ResponseEntity<GetUserNameRequest> getName(@PathVariable UUID userId) {
        return ResponseEntity.ok(service.getSellerName(userId));

    }
}

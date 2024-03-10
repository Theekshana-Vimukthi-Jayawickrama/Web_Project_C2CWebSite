package com.web_project.C2CECommerceSite.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(service.authenticate(request));
    }
}

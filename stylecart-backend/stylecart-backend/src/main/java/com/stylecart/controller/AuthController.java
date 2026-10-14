
package com.stylecart.controller;

import com.stylecart.dto.RegisterRequest;
import com.stylecart.dto.LoginRequest;
import com.stylecart.entity.User;
import com.stylecart.service.UserService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // CUSTOMER REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = new User(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                "CUSTOMER"
        );

        try {
            User savedUser = userService.register(user);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Registration successful",
                            "id", savedUser.getId(),
                            "name", savedUser.getName(),
                            "email", savedUser.getEmail(),
                            "role", savedUser.getRole()
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    // CUSTOMER LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        try {
            User user = userService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Login successful",
                            "id", user.getId(),
                            "name", user.getName(),
                            "email", user.getEmail(),
                            "role", user.getRole()
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("message", e.getMessage())
            );
        }
    }
}

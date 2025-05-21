package com.c8a.ball.dont.lie.controller;

import com.c8a.ball.dont.lie.jwt.JwtTokenUtil;
import com.c8a.ball.dont.lie.request.TokenRequest;
import com.c8a.ball.dont.lie.respone.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/token")
@RequiredArgsConstructor
public class TokenController {

    private final JwtTokenUtil jwtTokenUtil;

    @GetMapping
    public ResponseEntity<TokenResponse> getToken(
            @RequestParam(defaultValue = "VISITOR") String role,
            @RequestParam(required = false) List<String> permissions) {

        System.out.println("GET /token endpoint called with role: " + role);
        System.out.println("Permissions requested: " + permissions);

        if (permissions == null || permissions.isEmpty()) {
            permissions = Arrays.asList("READ");
            System.out.println("No permissions provided, defaulting to READ");

        }

        System.out.println("Token generated successfully for role: " + role);

        String token = jwtTokenUtil.generateToken(permissions, role);
        return ResponseEntity.ok(new TokenResponse(token));
    }

    @PostMapping
    public ResponseEntity<TokenResponse> createToken(@RequestBody TokenRequest request) {
        List<String> permissions = request.getPermissions();
        String role = request.getRole();

        System.out.println("Request data - Role: " + role + ", Permissions: " + permissions);

        if (permissions == null || permissions.isEmpty()) {
            permissions = Arrays.asList("READ");
            System.out.println("No permissions provided, defaulting to READ");
        }

        if (role == null || role.isEmpty()) {
            role = "VISITOR";
            System.out.println("No role provided, defaulting to VISITOR");
        }

        String token = jwtTokenUtil.generateToken(permissions, role);
        System.out.println("Token generated successfully for role: " + role);
        return ResponseEntity.ok(new TokenResponse(token));
    }
}

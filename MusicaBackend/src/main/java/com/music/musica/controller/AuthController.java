package com.music.musica.controller;

import com.music.musica.dto.AuthResponse;
import com.music.musica.dto.LoginRequest;
import com.music.musica.dto.UserDTO;
import com.music.musica.service.UserService;
import com.music.musica.security.JwtTokenProvider;
import com.music.musica.service.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(userDetails.getUsername());

        return ResponseEntity.ok(new AuthResponse(token, userDetails.getUsername(), userDetails.getAuthorities()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserDTO userDTO) {
        UserDTO registeredUser = userService.register(userDTO);

        String token = jwtTokenProvider.generateToken(registeredUser.getUsername());

        List<SimpleGrantedAuthority> authorities = registeredUser.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new AuthResponse(token, registeredUser.getUsername(), authorities));
    }
}

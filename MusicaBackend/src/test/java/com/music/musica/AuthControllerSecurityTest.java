package com.music.musica;

import com.music.musica.controller.AuthController;
import com.music.musica.dto.AuthResponse;
import com.music.musica.dto.LoginRequest;
import com.music.musica.dto.UserDTO;
import com.music.musica.security.JwtTokenProvider;
import com.music.musica.service.CustomUserDetails;
import com.music.musica.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerSecurityTest {

    private AuthController authController;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authController = new AuthController(authenticationManager, jwtTokenProvider, userService, null);
    }

    @Test
    void login_ShouldReturnTokenOnValidCredentials() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("user1");
        request.setPassword("password");

        var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        CustomUserDetails userDetails = new CustomUserDetails("user1", "password", true, authorities);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtTokenProvider.generateToken("user1", List.of("ROLE_USER", "ROLE_ADMIN"))).thenReturn("mocked-token");

        // Act
        ResponseEntity<AuthResponse> response = authController.login(request);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("mocked-token", response.getBody().getToken());
        assertEquals("user1", response.getBody().getUsername());
        assertEquals(authorities, response.getBody().getRoles());
    }

    @Test
    void login_ShouldThrowExceptionOnInvalidCredentials() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("user1");
        request.setPassword("wrong-password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        // Act & Assert
        try {
            authController.login(request);
        } catch (RuntimeException e) {
            assertEquals("Invalid credentials", e.getMessage());
        }
    }

    @Test
    void register_ShouldReturnTokenOnSuccessfulRegistration() {
        // Arrange
        var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("newuser");
        userDTO.setPassword("password");
        userDTO.setRoles(Collections.singletonList("ROLE_USER"));

        UserDTO registeredUser = new UserDTO();
        registeredUser.setUsername("newuser");
        registeredUser.setPassword("password");
        registeredUser.setRoles(Collections.singletonList("ROLE_USER"));

        when(userService.register(userDTO)).thenReturn(registeredUser);
        when(jwtTokenProvider.generateToken("newuser", List.of("ROLE_USER"))).thenReturn("mocked-token");

        // Act
        ResponseEntity<AuthResponse> response = authController.register(userDTO);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("mocked-token", response.getBody().getToken());
        assertEquals("newuser", response.getBody().getUsername());
        assertEquals(authorities, response.getBody().getRoles());
    }

    @Test
    void register_ShouldThrowExceptionOnInvalidData() {
        // Arrange
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("");
        userDTO.setPassword("password");
        userDTO.setRoles(Collections.singletonList("ROLE_USER"));

        when(userService.register(userDTO)).thenThrow(new RuntimeException("Invalid user data"));

        // Act & Assert
        try {
            authController.register(userDTO);
        } catch (RuntimeException e) {
            assertEquals("Invalid user data", e.getMessage());
        }
    }
}

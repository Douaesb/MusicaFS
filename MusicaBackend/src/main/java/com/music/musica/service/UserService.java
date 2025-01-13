package com.music.musica.service;

import com.music.musica.dto.UserDTO;
import com.music.musica.model.User;

import java.util.List;

public interface UserService {
    UserDTO register(UserDTO userDTO);
    List<UserDTO> getAllUsers();
    void updateUserRoles(String id, List<String> roles);
    User loadUserByUsername(String username);
}

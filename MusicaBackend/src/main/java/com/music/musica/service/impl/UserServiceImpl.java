package com.music.musica.service.impl;


import com.music.musica.dto.UserDTO;
import com.music.musica.exception.ResourceNotFoundException;
import com.music.musica.mapper.UserMapper;
import com.music.musica.model.Role;
import com.music.musica.model.User;
import com.music.musica.repository.RoleRepository;
import com.music.musica.repository.UserRepository;
import com.music.musica.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

//    @Override
//    public UserDTO register(UserDTO userDTO) {
//        User user = userMapper.toEntity(userDTO);
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        user.setRoles(List.of(roleRepository.findByName("USER")));
//        return userMapper.toDTO(userRepository.save(user));
//    }

    @Override
    public UserDTO register(UserDTO userDTO) {
        User user = userMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        List<Role> roles = userDTO.getRoles().stream()
                .map(roleName -> roleRepository.findByName(roleName))
                .collect(Collectors.toList());

        if (roles.isEmpty()) {
            roles.add(roleRepository.findByName("USER"));
        }

        user.setRoles(roles);

        return userMapper.toDTO(userRepository.save(user));
    }


    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public void updateUserRoles(String id, List<String> roles) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        List<Role> updatedRoles = roles.stream().map(roleRepository::findByName).collect(Collectors.toList());
        user.setRoles(updatedRoles);
        userRepository.save(user);
    }

    @Override
    public User loadUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

}

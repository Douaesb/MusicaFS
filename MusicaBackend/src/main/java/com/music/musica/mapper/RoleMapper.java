package com.music.musica.mapper;

import com.music.musica.dto.RoleDTO;
import com.music.musica.model.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDTO toDTO(Role role);

    Role toEntity(RoleDTO roleDTO);
}
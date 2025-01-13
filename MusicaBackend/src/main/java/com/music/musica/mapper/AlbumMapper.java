package com.music.musica.mapper;

import com.music.musica.dto.AlbumDTO;
import com.music.musica.model.Album;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AlbumMapper {
    AlbumDTO toDTO(Album album);

    Album toEntity(AlbumDTO albumDTO);
}

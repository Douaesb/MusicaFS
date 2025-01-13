package com.music.musica.mapper;


import com.music.musica.dto.ChansonDTO;
import com.music.musica.model.Chanson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChansonMapper {

    @Mapping(source = "album.id", target = "albumId")
    ChansonDTO toDTO(Chanson chanson);

    @Mapping(target = "album", ignore = true)
    Chanson toEntity(ChansonDTO chansonDTO);
}

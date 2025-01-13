package com.music.musica.service;

import com.music.musica.dto.ChansonDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ChansonService {
    Page<ChansonDTO> getAllChansons(Pageable pageable);
    Page<ChansonDTO> searchChansonsByTitle(String title, Pageable pageable);
    Page<ChansonDTO> getChansonsByAlbumId(String albumId, Pageable pageable);
    ChansonDTO createChanson(ChansonDTO chansonDTO);
    ChansonDTO updateChanson(String id, ChansonDTO chansonDTO);
    void deleteChanson(String id);
}
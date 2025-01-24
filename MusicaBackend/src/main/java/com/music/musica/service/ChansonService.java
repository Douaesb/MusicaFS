package com.music.musica.service;

import com.music.musica.dto.ChansonDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.web.multipart.MultipartFile;

public interface ChansonService {
    Page<ChansonDTO> getAllChansons(Pageable pageable);
    Page<ChansonDTO> searchChansonsByTitle(String title, Pageable pageable);
    Page<ChansonDTO> getChansonsByAlbumId(String albumId, Pageable pageable);
    ChansonDTO createChanson(ChansonDTO chansonDTO, MultipartFile audioFile);
    ChansonDTO updateChanson(String id, ChansonDTO chansonDTO, MultipartFile file);
    void deleteChanson(String id);
    GridFsResource getAudioFile(String fileId);
}
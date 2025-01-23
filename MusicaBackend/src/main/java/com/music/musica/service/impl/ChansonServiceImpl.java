package com.music.musica.service.impl;

import com.music.musica.dto.ChansonDTO;
import com.music.musica.mapper.ChansonMapper;
import com.music.musica.model.Album;
import com.music.musica.model.Chanson;
import com.music.musica.repository.AlbumRepository;
import com.music.musica.repository.ChansonRepository;
import com.music.musica.service.ChansonService;
import com.music.musica.service.GridFsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
public class ChansonServiceImpl implements ChansonService {

    private static final long MAX_FILE_SIZE_MB = 15 * 1024 * 1024;
    private static final String[] SUPPORTED_FILE_TYPES = {"audio/mpeg", "audio/wav", "audio/ogg"};

    @Autowired
    private ChansonRepository chansonRepository;

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private ChansonMapper chansonMapper;

    @Autowired
    private GridFsService gridFsService;

    @Override
    public Page<ChansonDTO> getAllChansons(Pageable pageable) {
        return chansonRepository.findAll(pageable).map(chansonMapper::toDTO);
    }

    @Override
    public Page<ChansonDTO> searchChansonsByTitle(String title, Pageable pageable) {
        return chansonRepository.findByTitleContaining(title, pageable).map(chansonMapper::toDTO);
    }

    @Override
    public Page<ChansonDTO> getChansonsByAlbumId(String albumId, Pageable pageable) {
        return chansonRepository.findByAlbumId(albumId, pageable).map(chansonMapper::toDTO);
    }

    @Override
    public ChansonDTO createChanson(ChansonDTO chansonDTO, MultipartFile audioFile) {
        validateAudioFile(audioFile);

        String audioFileId = gridFsService.saveFile(audioFile);
        Album album = albumRepository.findById(chansonDTO.getAlbumId())
                .orElseThrow(() -> new IllegalArgumentException("Album not found"));

        Chanson chanson = chansonMapper.toEntity(chansonDTO);
        chanson.setAlbum(album);
        chanson.setAudioFileId(audioFileId);
        chanson.setDateAjout(LocalDateTime.now());
        return chansonMapper.toDTO(chansonRepository.save(chanson));
    }

    @Override
    public ChansonDTO updateChanson(String id, ChansonDTO chansonDTO, MultipartFile file) {
        Album album = albumRepository.findById(chansonDTO.getAlbumId())
                .orElseThrow(() -> new IllegalArgumentException("Album not found"));

        Chanson chanson = chansonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Chanson not found"));

        chanson.setTitle(chansonDTO.getTitle());
        chanson.setDuree(chansonDTO.getDuree());
        chanson.setTrackNumber(chansonDTO.getTrackNumber());
        chanson.setDescription(chansonDTO.getDescription());
        chanson.setCategorie(chansonDTO.getCategorie());
        chanson.setAlbum(album);
        chanson.setDateAjout(LocalDateTime.now());
        if (file != null && !file.isEmpty()) {
            validateAudioFile(file);
            String audioFileId = gridFsService.saveFile(file);
            chanson.setAudioFileId(audioFileId);
        }

        return chansonMapper.toDTO(chansonRepository.save(chanson));
    }

    @Override
    public void deleteChanson(String id) {
        Chanson chanson = chansonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Chanson not found"));

        if (chanson.getAudioFileId() != null) {
            gridFsService.deleteFile(chanson.getAudioFileId());
        }

        chansonRepository.deleteById(id);
    }

    // Helper method to validate the uploaded file
    private void validateAudioFile(MultipartFile audioFile) {
        if (audioFile.getSize() > MAX_FILE_SIZE_MB) {
            throw new IllegalArgumentException("File size exceeds the 15MB limit");
        }

        String fileType = audioFile.getContentType();
        if (fileType == null || !isSupportedFileType(fileType)) {
            throw new IllegalArgumentException("Unsupported file type. Allowed types: MP3, WAV, OGG");
        }
    }

    private boolean isSupportedFileType(String fileType) {
        for (String supportedType : SUPPORTED_FILE_TYPES) {
            if (supportedType.equals(fileType)) {
                return true;
            }
        }
        return false;
    }
}

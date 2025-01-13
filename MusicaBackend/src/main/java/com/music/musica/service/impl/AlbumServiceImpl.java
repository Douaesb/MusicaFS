package com.music.musica.service.impl;

import com.music.musica.dto.AlbumDTO;
import com.music.musica.mapper.AlbumMapper;
import com.music.musica.model.Album;
import com.music.musica.repository.AlbumRepository;
import com.music.musica.service.AlbumService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AlbumServiceImpl implements AlbumService {

    private final AlbumRepository albumRepository;
    private final AlbumMapper albumMapper;

    public AlbumServiceImpl(AlbumRepository albumRepository, AlbumMapper albumMapper) {
        this.albumRepository = albumRepository;
        this.albumMapper = albumMapper;
    }

    @Override
    public Page<AlbumDTO> getAllAlbums(Pageable pageable) {
        return albumRepository.findAll(pageable).map(albumMapper::toDTO);
    }

    @Override
    public Page<AlbumDTO> searchAlbumsByTitle(String title, Pageable pageable) {
        return albumRepository.findByTitleContaining(title, pageable).map(albumMapper::toDTO);
    }

    @Override
    public Page<AlbumDTO> searchAlbumsByArtist(String artist, Pageable pageable) {
        return albumRepository.findByArtist(artist, pageable).map(albumMapper::toDTO);
    }

    @Override
    public Page<AlbumDTO> filterAlbumsByYear(Integer year, Pageable pageable) {
        return albumRepository.findByYear(year, pageable).map(albumMapper::toDTO);
    }

    @Override
    public AlbumDTO createAlbum(AlbumDTO albumDTO) {
        Album album = albumMapper.toEntity(albumDTO);
        return albumMapper.toDTO(albumRepository.save(album));
    }

    @Override
    public AlbumDTO updateAlbum(String id, AlbumDTO albumDTO) {
        Album album = albumMapper.toEntity(albumDTO);
        album.setId(id);
        return albumMapper.toDTO(albumRepository.save(album));
    }

    @Override
    public void deleteAlbum(String id) {
        albumRepository.deleteById(id);
    }
}

package com.music.musica.service;

import com.music.musica.dto.AlbumDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AlbumService {
    Page<AlbumDTO> getAllAlbums(Pageable pageable);
    Page<AlbumDTO> searchAlbumsByTitle(String title, Pageable pageable);
    Page<AlbumDTO> searchAlbumsByArtist(String artist, Pageable pageable);
    Page<AlbumDTO> filterAlbumsByYear(Integer year, Pageable pageable);
    AlbumDTO createAlbum(AlbumDTO albumDTO);
    AlbumDTO updateAlbum(String id, AlbumDTO albumDTO);
    void deleteAlbum(String id);
}
package com.music.musica;


import com.music.musica.dto.AlbumDTO;
import com.music.musica.mapper.AlbumMapper;
import com.music.musica.model.Album;
import com.music.musica.repository.AlbumRepository;
import com.music.musica.service.impl.AlbumServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class AlbumServiceImplTest {

    @Mock
    private AlbumRepository albumRepository;

    @Mock
    private AlbumMapper albumMapper;

    private AlbumServiceImpl albumService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        albumService = new AlbumServiceImpl(albumRepository, albumMapper);
    }

    @Test
    void testGetAllAlbums() {
        // Arrange
        Album album = new Album();
        album.setId("1");
        album.setTitle("Album 1");
        album.setArtist("Artist 1");
        PageRequest pageable = PageRequest.of(0, 10);
        List<Album> albums = Arrays.asList(album);
        Page<Album> albumPage = new PageImpl<>(albums, pageable, albums.size());
        AlbumDTO albumDTO = new AlbumDTO();
        albumDTO.setId("1");
        albumDTO.setTitle("Album 1");
        albumDTO.setArtist("Artist 1");

        when(albumRepository.findAll(pageable)).thenReturn(albumPage);
        when(albumMapper.toDTO(album)).thenReturn(albumDTO);

        // Act
        Page<AlbumDTO> result = albumService.getAllAlbums(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Album 1", result.getContent().get(0).getTitle());
        verify(albumRepository, times(1)).findAll(pageable);
    }

    @Test
    void testGetAllAlbumsEmpty() {
        // Arrange
        PageRequest pageable = PageRequest.of(0, 10);
        Page<Album> emptyPage = new PageImpl<>(List.of(), pageable, 0);

        when(albumRepository.findAll(pageable)).thenReturn(emptyPage);

        // Act
        Page<AlbumDTO> result = albumService.getAllAlbums(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        verify(albumRepository, times(1)).findAll(pageable);
    }


    @Test
    void testSearchAlbumsByTitle() {
        // Arrange
        Album album = new Album();
        album.setId("1");
        album.setTitle("Album 1");
        PageRequest pageable = PageRequest.of(0, 10);
        List<Album> albums = Arrays.asList(album);
        Page<Album> albumPage = new PageImpl<>(albums, pageable, albums.size());
        AlbumDTO albumDTO = new AlbumDTO();
        albumDTO.setId("1");
        albumDTO.setTitle("Album 1");

        when(albumRepository.findByTitleContaining("Album", pageable)).thenReturn(albumPage);
        when(albumMapper.toDTO(album)).thenReturn(albumDTO);

        // Act
        Page<AlbumDTO> result = albumService.searchAlbumsByTitle("Album", pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Album 1", result.getContent().get(0).getTitle());
        verify(albumRepository, times(1)).findByTitleContaining("Album", pageable);
    }
    @Test
    void testSearchAlbumsByTitleNoMatch() {
        // Arrange
        String title = "NonExistentAlbum";
        PageRequest pageable = PageRequest.of(0, 10);
        Page<Album> emptyPage = new PageImpl<>(List.of(), pageable, 0);

        when(albumRepository.findByTitleContaining(title, pageable)).thenReturn(emptyPage);

        // Act
        Page<AlbumDTO> result = albumService.searchAlbumsByTitle(title, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        verify(albumRepository, times(1)).findByTitleContaining(title, pageable);
    }


    @Test
    void testCreateAlbum() {
        // Arrange
        AlbumDTO albumDTO = new AlbumDTO();
        albumDTO.setTitle("New Album");
        albumDTO.setArtist("New Artist");

        Album album = new Album();
        album.setTitle("New Album");
        album.setArtist("New Artist");

        AlbumDTO resultDTO = new AlbumDTO();
        resultDTO.setTitle("New Album");
        resultDTO.setArtist("New Artist");

        when(albumMapper.toEntity(albumDTO)).thenReturn(album);
        when(albumRepository.save(album)).thenReturn(album);
        when(albumMapper.toDTO(album)).thenReturn(resultDTO);

        // Act
        AlbumDTO result = albumService.createAlbum(albumDTO);

        // Assert
        assertNotNull(result);
        assertEquals("New Album", result.getTitle());
        assertEquals("New Artist", result.getArtist());
        verify(albumRepository, times(1)).save(album);
    }

    @Test
    void testUpdateAlbum() {
        // Arrange
        String albumId = "1";
        AlbumDTO albumDTO = new AlbumDTO();
        albumDTO.setTitle("Updated Album");
        albumDTO.setArtist("Updated Artist");

        Album album = new Album();
        album.setId(albumId);
        album.setTitle("Updated Album");
        album.setArtist("Updated Artist");

        AlbumDTO resultDTO = new AlbumDTO();
        resultDTO.setTitle("Updated Album");
        resultDTO.setArtist("Updated Artist");

        when(albumMapper.toEntity(albumDTO)).thenReturn(album);
        when(albumRepository.save(album)).thenReturn(album);
        when(albumMapper.toDTO(album)).thenReturn(resultDTO);

        // Act
        AlbumDTO result = albumService.updateAlbum(albumId, albumDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Album", result.getTitle());
        assertEquals("Updated Artist", result.getArtist());
        verify(albumRepository, times(1)).save(album);
    }

    @Test
    void testDeleteAlbum() {
        // Arrange
        String albumId = "1";

        doNothing().when(albumRepository).deleteById(albumId);

        // Act
        albumService.deleteAlbum(albumId);

        // Assert
        verify(albumRepository, times(1)).deleteById(albumId);
    }

    @Test
    void testDeleteAlbumNonExisting() {
        // Arrange
        String albumId = "999";

        doThrow(new RuntimeException("Album not found")).when(albumRepository).deleteById(albumId);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> albumService.deleteAlbum(albumId));
        assertEquals("Album not found", exception.getMessage());
        verify(albumRepository, times(1)).deleteById(albumId);
    }

}

package com.music.musica;


import com.music.musica.dto.AlbumDTO;
import com.music.musica.model.Album;
import com.music.musica.repository.AlbumRepository;
import com.music.musica.mapper.AlbumMapper;
import com.music.musica.service.impl.AlbumServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AlbumServiceImplIntegrationTest {

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private AlbumMapper albumMapper;

    @Autowired
    private AlbumServiceImpl albumService;

    @BeforeEach
    void setUp() {
        // Clear the database before each test
        albumRepository.deleteAll();
    }

    @Test
    void testCreateAlbumIntegration() {
        // Arrange
        AlbumDTO albumDTO = new AlbumDTO();
        albumDTO.setTitle("Test Album");
        albumDTO.setArtist("Test Artist");

        // Act
        AlbumDTO resultDTO = albumService.createAlbum(albumDTO);

        // Assert
        assertNotNull(resultDTO);
        assertEquals("Test Album", resultDTO.getTitle());
        assertEquals("Test Artist", resultDTO.getArtist());

        Album savedAlbum = albumRepository.findById(resultDTO.getId()).orElse(null);
        assertNotNull(savedAlbum);
        assertEquals("Test Album", savedAlbum.getTitle());
    }

    @Test
    void testGetAllAlbumsIntegration() {
        // Arrange
        Album album1 = new Album();
        album1.setTitle("Album 1");
        album1.setArtist("Artist 1");
        albumRepository.save(album1);

        Album album2 = new Album();
        album2.setTitle("Album 2");
        album2.setArtist("Artist 2");
        albumRepository.save(album2);

        PageRequest pageable = PageRequest.of(0, 10);

        // Act
        Page<AlbumDTO> result = albumService.getAllAlbums(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals("Album 1", result.getContent().get(0).getTitle());
        assertEquals("Album 2", result.getContent().get(1).getTitle());
    }

    @Test
    void testSearchAlbumsByTitleIntegration() {
        // Arrange
        Album album1 = new Album();
        album1.setTitle("Rock Album");
        album1.setArtist("Artist 1");
        albumRepository.save(album1);

        Album album2 = new Album();
        album2.setTitle("Pop Album");
        album2.setArtist("Artist 2");
        albumRepository.save(album2);

        PageRequest pageable = PageRequest.of(0, 10);

        // Act
        Page<AlbumDTO> result = albumService.searchAlbumsByTitle("Rock", pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Rock Album", result.getContent().get(0).getTitle());
    }

    @Test
    void testUpdateAlbumIntegration() {
        // Arrange
        Album album = new Album();
        album.setTitle("Old Title");
        album.setArtist("Artist");
        albumRepository.save(album);

        AlbumDTO albumDTO = new AlbumDTO();
        albumDTO.setTitle("Updated Title");
        albumDTO.setArtist("Updated Artist");

        // Act
        AlbumDTO updatedAlbumDTO = albumService.updateAlbum(album.getId(), albumDTO);

        // Assert
        assertNotNull(updatedAlbumDTO);
        assertEquals("Updated Title", updatedAlbumDTO.getTitle());
        assertEquals("Updated Artist", updatedAlbumDTO.getArtist());

        Album updatedAlbum = albumRepository.findById(updatedAlbumDTO.getId()).orElse(null);
        assertNotNull(updatedAlbum);
        assertEquals("Updated Title", updatedAlbum.getTitle());
        assertEquals("Updated Artist", updatedAlbum.getArtist());
    }

    @Test
    void testDeleteAlbumIntegration() {
        // Arrange
        Album album = new Album();
        album.setTitle("Album to be deleted");
        album.setArtist("Artist");
        albumRepository.save(album);

        // Act
        albumService.deleteAlbum(album.getId());

        // Assert
        assertFalse(albumRepository.existsById(album.getId()));
    }

    @Test
    void testFilterAlbumsByYearIntegration() {
        // Arrange
        Album album1 = new Album();
        album1.setTitle("Album 2020");
        album1.setArtist("Artist 1");
        album1.setYear(2020);
        albumRepository.save(album1);

        Album album2 = new Album();
        album2.setTitle("Album 2021");
        album2.setArtist("Artist 2");
        album2.setYear(2021);
        albumRepository.save(album2);

        PageRequest pageable = PageRequest.of(0, 10);

        // Act
        Page<AlbumDTO> result = albumService.filterAlbumsByYear(2020, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Album 2020", result.getContent().get(0).getTitle());
    }
}

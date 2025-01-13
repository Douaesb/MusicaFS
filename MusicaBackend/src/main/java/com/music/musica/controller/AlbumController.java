package com.music.musica.controller;

import com.music.musica.dto.AlbumDTO;
import com.music.musica.service.AlbumService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AlbumController {

    private final AlbumService albumService;

    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    @GetMapping({"/user/albums", "/admin/albums"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<AlbumDTO>> getAllAlbums(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(albumService.getAllAlbums(pageable));
    }

    @GetMapping({"/user/albums/search", "/admin/albums/search"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<AlbumDTO>> searchAlbumsByTitle(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(albumService.searchAlbumsByTitle(title, pageable));
    }

    @GetMapping({"/user/albums/artist", "/admin/albums/artist"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<AlbumDTO>> searchAlbumsByArtist(
            @RequestParam String artist,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(albumService.searchAlbumsByArtist(artist, pageable));
    }

    @GetMapping({"/user/albums/year", "/admin/albums/year"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<AlbumDTO>> filterAlbumsByYear(
            @RequestParam Integer year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(albumService.filterAlbumsByYear(year, pageable));
    }

    @PostMapping({"/admin/albums", "/user/albums"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AlbumDTO> createAlbum(@RequestBody AlbumDTO albumDTO) {
        return ResponseEntity.ok(albumService.createAlbum(albumDTO));
    }

    @PutMapping("/admin/albums/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AlbumDTO> updateAlbum(@PathVariable String id, @RequestBody AlbumDTO albumDTO) {
        return ResponseEntity.ok(albumService.updateAlbum(id, albumDTO));
    }

    @DeleteMapping("/admin/albums/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAlbum(@PathVariable String id) {
        albumService.deleteAlbum(id);
        return ResponseEntity.noContent().build();
    }
}

package com.music.musica.controller;

import com.music.musica.dto.ChansonDTO;
import com.music.musica.service.ChansonService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChansonController {

    private final ChansonService chansonService;

    public ChansonController(ChansonService chansonService) {
        this.chansonService = chansonService;
    }

    @GetMapping({"/user/chansons", "/admin/chansons"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<ChansonDTO>> getAllChansons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(chansonService.getAllChansons(pageable));
    }

    @GetMapping({"/user/chansons/search", "/admin/chansons/search"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<ChansonDTO>> searchChansonsByTitle(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(chansonService.searchChansonsByTitle(title, pageable));
    }

    @GetMapping({"/user/chansons/album", "/admin/chansons/album"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<ChansonDTO>> getChansonsByAlbumId(
            @RequestParam String albumId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(chansonService.getChansonsByAlbumId(albumId, pageable));
    }

    @PostMapping("/admin/chansons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChansonDTO> createChanson(@RequestBody ChansonDTO chansonDTO) {
        return ResponseEntity.ok(chansonService.createChanson(chansonDTO));
    }

    @PutMapping("/admin/chansons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChansonDTO> updateChanson(@PathVariable String id, @RequestBody ChansonDTO chansonDTO) {
        return ResponseEntity.ok(chansonService.updateChanson(id, chansonDTO));
    }

    @DeleteMapping("/admin/chansons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteChanson(@PathVariable String id) {
        chansonService.deleteChanson(id);
        return ResponseEntity.noContent().build();
    }
}

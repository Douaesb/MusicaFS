package com.music.musica.repository;

import com.music.musica.model.Chanson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChansonRepository extends MongoRepository<Chanson, String> {
    Page<Chanson> findByTitleContaining(String title, Pageable pageable);
    Page<Chanson> findByAlbumId(String albumId, Pageable pageable);
}

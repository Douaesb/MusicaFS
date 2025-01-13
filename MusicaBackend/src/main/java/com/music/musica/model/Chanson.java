package com.music.musica.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "chansons")
public class Chanson {

    @Id
    private String id;

    private String title;

    private Integer duree;

    private Integer trackNumber;

    private Album album;
}

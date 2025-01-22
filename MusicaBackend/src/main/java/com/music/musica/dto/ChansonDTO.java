package com.music.musica.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Date;

@Data
public class ChansonDTO {

    private String id;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be a positive number")
    private Integer duree;

    @NotNull(message = "Track number is required")
    @Positive(message = "Track number must be a positive number")
    private Integer trackNumber;

    @Size(max = 200, message = "Description must not exceed 200 characters")
    private String description;

    private String categorie;

    private Date dateAjout;

    private String audioFileId;

    @NotBlank(message = "Album ID is required")
    private String albumId;
}

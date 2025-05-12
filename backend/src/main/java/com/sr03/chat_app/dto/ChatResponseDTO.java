package com.sr03.chat_app.dto;

import java.time.LocalDateTime;

public class ChatResponseDTO {
    private int id;
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private int durationMinutes;
    private String creatorUsername; // or creatorId if needed

    public ChatResponseDTO() {}

    public ChatResponseDTO(int id, String title, String description, LocalDateTime dateTime, int durationMinutes, String creatorUsername) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dateTime = dateTime;
        this.durationMinutes = durationMinutes;
        this.creatorUsername = creatorUsername;
    }
    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public String getCreatorUsername() {
        return creatorUsername;
    }


    // Getters and setters...
}

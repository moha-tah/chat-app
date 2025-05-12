package com.sr03.chat_app.dto;

import java.time.LocalDateTime;

public class ChatDTO {
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private int durationMinutes;
    private int creatorId;

    // Constructors
    public ChatDTO() {}

    public ChatDTO(String title, String description, LocalDateTime dateTime, int durationMinutes, int creatorId) {
        this.title = title;
        this.description = description;
        this.dateTime = dateTime;
        this.durationMinutes = durationMinutes;
        this.creatorId = creatorId;
    }

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public int getCreatorId() { return creatorId; }
    public void setCreatorId(int creatorId) { this.creatorId = creatorId; }
}

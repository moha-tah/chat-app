package com.sr03.chat_app.dtos;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ChatDto {
    private String title;
    private String description;
    private LocalDateTime date;
    private int duration;
    private int creatorId;
    private List<Integer> invitedUserIds;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        this.date = LocalDateTime.parse(dateString, formatter);
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public int getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(int creatorId) {
        this.creatorId = creatorId;
    }

    public List<Integer> getInvitedUserIds() {
        return invitedUserIds;
    }

    public void setInvitedUserIds(List<Integer> invitedUserIds) {
        this.invitedUserIds = invitedUserIds;
    }
}
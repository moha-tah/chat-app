package com.sr03.chat_app.websockets;

import java.util.Date;

public class SimplifiedMessageSocket {
    private String message;
    private String type;
    private Integer userId;
    private String username;
    private String avatarUrl;
    private Date date;

    public SimplifiedMessageSocket() {
    }

    public SimplifiedMessageSocket(String message, String type, Integer userId) {
        this.message = message;
        this.type = type;
        this.userId = userId;
        this.username = null;
        this.avatarUrl = null;
        this.date = null;
    }

    public SimplifiedMessageSocket(String message, String type, Integer userId, String username, String avatarUrl,
            Date date) {
        this.message = message;
        this.type = type;
        this.userId = userId;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.date = date;
    }

    // Create a simplified version from a full MessageSocket
    public static SimplifiedMessageSocket fromMessageSocket(MessageSocket fullMessage) {
        return new SimplifiedMessageSocket(
                fullMessage.getMessage(),
                fullMessage.getType(),
                fullMessage.getUserId(),
                fullMessage.getUsername(),
                fullMessage.getAvatarUrl(),
                fullMessage.getDate());
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
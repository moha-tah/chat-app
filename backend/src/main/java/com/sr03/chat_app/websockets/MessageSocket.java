package com.sr03.chat_app.websockets;

import java.util.Date;

public class MessageSocket {

    private String message;
    private String type;
    private Integer userId;
    private Integer chatId;
    private String username;
    private String avatarUrl;
    private Date date;

    public MessageSocket() {
    }

    public MessageSocket(String message, String type, Integer userId, Integer chatId, String username, String avatarUrl,
            Date date) {
        this.message = message;
        this.type = type;
        this.userId = userId;
        this.chatId = chatId;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.date = date;
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

    public Integer getChatId() {
        return chatId;
    }

    public void setChatId(Integer chatId) {
        this.chatId = chatId;
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

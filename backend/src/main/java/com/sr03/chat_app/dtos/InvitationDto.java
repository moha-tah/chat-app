package com.sr03.chat_app.dtos;

public class InvitationDto {
    private String chatId;
    private int userId;

    public String getChatId() {
        return chatId;
    }

    public int getUserId() {
        return userId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
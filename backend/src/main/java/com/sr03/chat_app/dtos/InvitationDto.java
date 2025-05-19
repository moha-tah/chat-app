package com.sr03.chat_app.dtos;

public class InvitationDto {
    private int chatId;
    private int userId;

    public int getChatId() {
        return chatId;
    }

    public int getUserId() {
        return userId;
    }

    public void setChatId(int chatId) {
        this.chatId = chatId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
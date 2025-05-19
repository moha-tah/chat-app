package com.sr03.chat_app.websockets;

public class MessageSocket {

    private String message;
    private String type;
    private Integer userId;
    private Integer chatId;

    public MessageSocket() {
    }

    public MessageSocket(String message, String type, Integer userId, Integer chatId) {
        this.message = message;
        this.type = type;
        this.userId = userId;
        this.chatId = chatId;
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
}

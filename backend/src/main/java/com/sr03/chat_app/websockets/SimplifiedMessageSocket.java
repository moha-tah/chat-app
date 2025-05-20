package com.sr03.chat_app.websockets;


public class SimplifiedMessageSocket {
    private String message;
    private String type;
    private Integer userId;

    public SimplifiedMessageSocket() {
    }

    public SimplifiedMessageSocket(String message, String type, Integer userId) {
        this.message = message;
        this.type = type;
        this.userId = userId;
    }

    // Create a simplified version from a full MessageSocket
    public static SimplifiedMessageSocket fromMessageSocket(MessageSocket fullMessage) {
        return new SimplifiedMessageSocket(
                fullMessage.getMessage(),
                fullMessage.getType(),
                fullMessage.getUserId()
        );
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
}
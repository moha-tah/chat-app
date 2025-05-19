package com.sr03.chat_app.security;

public class UnauthorizedAdminAccessException extends RuntimeException {
    public UnauthorizedAdminAccessException(String message) {
        super(message);
    }

    public UnauthorizedAdminAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
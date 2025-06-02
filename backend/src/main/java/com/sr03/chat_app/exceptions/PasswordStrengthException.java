package com.sr03.chat_app.exceptions;

public class PasswordStrengthException extends RuntimeException {
    public PasswordStrengthException(String message) {
        super(message);
    }
}
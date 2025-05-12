package com.sr03.chat_app.dtos;

public class UserDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private boolean isActive;
    private boolean isAdmin;

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public boolean isActive() {
        return isActive;
    }

    public boolean isAdmin() {
        return isAdmin;
    }
}
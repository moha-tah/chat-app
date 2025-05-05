package com.sr03.chat_app.dtos;

public class CreateUserDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
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

    public boolean getIsAdmin() {
        return isAdmin;
    }
}
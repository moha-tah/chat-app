package com.sr03.chat_app.dtos;

import com.sr03.chat_app.models.User;

public class ParticipantDto {
    private Integer id;
    private String firstName;
    private String lastName;
    private String avatarUrl;

    public ParticipantDto() {
    }

    public ParticipantDto(Integer id, String firstName, String lastName, String avatarUrl) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatarUrl = avatarUrl;
    }

    public static ParticipantDto fromUser(User user) {
        return new ParticipantDto(user.getId(), user.getFirstName(), user.getLastName(), user.getAvatarUrl());
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
package com.sr03.chat_app.models;

import jakarta.persistence.*;

@Entity
@Table(name = "invitations")
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    // @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // === Constructors ===

    public Invitation() {
        // Required for JPA
    }

    public Invitation(Chat chat, User user) {
        this.chat = chat;
        this.user = user;
    }

    // === Getters and Setters ===

    public int getId() {
        return id;
    }

    public void setId(int invitationId) {
        this.id = invitationId;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

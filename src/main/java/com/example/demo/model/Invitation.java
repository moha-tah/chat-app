package com.example.demo.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "invitation") // <-- exactly as in your PostgreSQL database
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int invitationId; // Primary key of the table

    @ManyToOne
    @JoinColumn(name = "chat", nullable = false) // "chat" column (uuid) in your table
    private Chat chat;

    @ManyToOne
    @JoinColumn(name = "user", nullable = false) // "user" column (integer) in your table
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

    public int getInvitationId() {
        return invitationId;
    }

    public void setInvitationId(int invitationId) {
        this.invitationId = invitationId;
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

package com.sr03.chat_app.models;

import java.time.LocalDateTime;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "chats")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 4095)
    private String description;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "duration", nullable = false)
    private int duration; // in minutes

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @JsonIgnore
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Invitation> invitations = new HashSet<>();

    // No-argument constructor required by JPA
    public Chat() {
    }

    public Chat(String title, String description, LocalDateTime date, int duration, User creator) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.duration = duration;
        this.creator = creator;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime dateTime) {
        this.date = dateTime;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int durationMinutes) {
        this.duration = durationMinutes;
    }

    public User getCreator() {
        return creator;
    }

    public Set<Invitation> getInvitations() {
        return invitations;
    }

    public void setInvitations(Set<Invitation> invitations) {
        this.invitations = invitations;
    }

    public void addInvitation(User user) {
        Invitation invitation = new Invitation(this, user);
        invitations.add(invitation);
    }
}

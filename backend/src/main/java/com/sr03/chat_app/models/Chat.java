package com.sr03.chat_app.models;

import java.time.LocalDateTime;
import java.util.*;

import jakarta.persistence.*;

@Entity
@Table(name = "chats")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 4095)
    private String description;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "duration", nullable = false)
    private int duration;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Invitation> invitations = new HashSet<>();

    // No-argument constructor required by JPA
    public Chat() {
    }

    public Chat(String title, String description, LocalDateTime date, int duration, User creator) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.description = description;
        this.date = date;
        this.duration = duration;
        this.creator = creator;
    }
    
    public String getId() {
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

    public void addInvitation(User user) {
        Invitation invitation = new Invitation(this, user); // create an Invitation
        invitations.add(invitation);
        user.getInvitations().add(invitation); // Add to the user's invitations too
    }
}

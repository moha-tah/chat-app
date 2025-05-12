package com.sr03.chat_app.models;

import java.time.LocalDateTime;
import java.util.*;

import jakarta.persistence.*;

@Entity
@Table(name = "chat")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Invitation> invitations = new HashSet<>(); // Replaces the ManyToMany

    // No-argument constructor required by JPA
    public Chat() {
    }

    //Constructor with parameters
    public Chat(String title, String description, LocalDateTime dateTime, int durationMinutes, User creator) {
        this.title = title;
        this.description = description;
        this.dateTime = dateTime;
        this.durationMinutes = durationMinutes;
        this.creator = creator;
    }

    // Getters and Setters
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

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }


    public User getCreator() {

        return this.creator;
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










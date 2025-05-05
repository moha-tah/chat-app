package com.example.demo.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user") // Optional, you can keep this if the table name is exactly "utilisateur"
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // because your database uses integer primary key
    private int id;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "email", nullable = false, unique = true) // assuming emails should be unique
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "is_admin", nullable = false)
    private boolean isAdmin;

    @OneToMany(mappedBy = "creator") // chats created by this user
    private Set<Chat> createdChats = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Invitation> invitations = new HashSet<>();

    // === Constructors ===

    public User() {
        // No-arg constructor needed by JPA
    }

    public User(String lastName, String firstName, String email, String password, boolean isAdmin) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    // === Getters and Setters ===

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public Set<Chat> getCreatedChats() {
        return createdChats;
    }

    public Set<Invitation> getInvitations() {
        return invitations;
    }

    // === Methods to manage relationships ===

    // Add a chat to the user's created chats
    public void addCreatedChat(Chat chat) {
        createdChats.add(chat);
    }

    // Add an invitation (not the chat directly) to the user's invitations
    public void addInvitation(Invitation invitation) {
        invitations.add(invitation);
    }

    // If you want to add a user directly to a chat, you'd create an invitation first
    public void inviteUserToChat(Invitation invitation) {
        invitations.add(invitation);
        invitation.getChat().getInvitations().add(invitation);  // Update the reverse side of the relationship
    }
}

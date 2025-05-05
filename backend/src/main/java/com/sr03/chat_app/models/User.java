package com.sr03.chat_app.models;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "password_salt", nullable = false)
    private String passwordSalt;

    @Column(name = "is_admin", nullable = false)
    private boolean isAdmin;

    @OneToMany(mappedBy = "creator")
    private Set<Chat> createdChats = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Invitation> invitations = new HashSet<>();

    // === Constructors ===

    public User() {
        // No-arg constructor needed by JPA
    }

    public User(String lastName, String firstName, String email, String passwordHash, boolean isAdmin) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.passwordHash = passwordHash;
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

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPasswordSalt() {
        return passwordSalt;
    }

    public void setPasswordSalt(String passwordSalt) {
        this.passwordSalt = passwordSalt;
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

    // If you want to add a user directly to a chat, you'd create an invitation
    // first
    public void inviteUserToChat(Invitation invitation) {
        invitations.add(invitation);
        invitation.getChat().getInvitations().add(invitation); // Update the reverse side of the relationship
    }
}

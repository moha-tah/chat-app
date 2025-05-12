package com.sr03.chat_app.controllers;

import com.sr03.chat_app.models.Chat;
import com.sr03.chat_app.models.Invitation;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.repositories.ChatRepository;
import com.sr03.chat_app.repositories.InvitationRepository;
import com.sr03.chat_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Invitation createInvitation(@RequestParam String chatId, @RequestParam int userId) {
        Chat chat = chatRepository.findById(chatId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        Invitation invitation = new Invitation(chat, user);
        return invitationRepository.save(invitation);
    }

    @GetMapping
    public List<Invitation> getAllInvitations() {
        return invitationRepository.findAll();
    }
}



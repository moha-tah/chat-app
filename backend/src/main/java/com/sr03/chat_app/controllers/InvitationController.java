package com.sr03.chat_app.controllers;

import com.sr03.chat_app.dtos.InvitationDto;
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
@RequestMapping("invitations")
public class InvitationController {

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Invitation createInvitation(@RequestBody InvitationDto invitationDto) {
        Chat chat = chatRepository.findById(invitationDto.getChatId()).orElseThrow();
        User user = userRepository.findById(invitationDto.getUserId()).orElseThrow();

        Invitation invitation = new Invitation(chat, user);
        return invitationRepository.save(invitation);
    }

    @GetMapping
    public List<Invitation> getAllInvitations() {
        return invitationRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteInvitation(@PathVariable int id) {
        invitationRepository.deleteById(id);
    }

    @GetMapping("/users/{id}/sent")
    public List<Invitation> getInvitationsByUserIdSent(@PathVariable int id) {
        return invitationRepository.findBySenderId(id);
    }

    @GetMapping("/users/{id}/received")
    public List<Invitation> getInvitationsByUserIdReceived(@PathVariable int id) {
        return invitationRepository.findByReceiverId(id);
    }
}

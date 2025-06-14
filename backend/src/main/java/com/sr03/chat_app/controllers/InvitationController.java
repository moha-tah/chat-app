package com.sr03.chat_app.controllers;

import com.sr03.chat_app.dtos.InvitationDto;
import com.sr03.chat_app.models.Invitation;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.services.InvitationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("invitations")
public class InvitationController {

    @Autowired
    private InvitationService invitationService;

    @PostMapping
    public Invitation createInvitation(@RequestBody InvitationDto invitationDto) {
        return invitationService.createInvitation(invitationDto);
    }

    @GetMapping
    public List<Invitation> getAllInvitations() {
        return invitationService.getAllInvitations();
    }

    @DeleteMapping("/{id}")
    public void deleteInvitation(@PathVariable int id) {
        invitationService.deleteInvitation(id);
    }

    @GetMapping("/users/{id}")
    public List<Invitation> getInvitationsByUserIdSent(@PathVariable int id) {
        return invitationService.getInvitationsByUserIdSent(id);
    }

    @GetMapping("/chats/{id}")
    public List<Invitation> getInvitationsByChatId(@PathVariable int id) {
        return invitationService.getInvitationsByChatId(id);
    }

    @GetMapping("/chats/{chatId}/users")
    public List<User> getInvitedUsersByChatId(@PathVariable int chatId) {
        return invitationService.getInvitedUsersByChatId(chatId);
    }
}

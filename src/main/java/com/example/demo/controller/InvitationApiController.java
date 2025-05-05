package com.example.demo.controller;
import com.example.demo.model.Chat;
import com.example.demo.model.Invitation;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.repository.invitationdata ;
import com.example.demo.repository.chatdata ;
import com.example.demo.repository.userdata ;
import java.util.List;

@RestController
@RequestMapping("/api/invitations")
public class InvitationApiController {

    @Autowired
    private invitationdata invitationRepo;

    @Autowired
    private chatdata chatRepo;

    @Autowired
    private userdata userRepo;

    @PostMapping
    public Invitation createInvitation(@RequestParam String chatId, @RequestParam int userId) {
        Chat chat = chatRepo.findById(chatId).orElseThrow();
        User user = userRepo.findById(userId).orElseThrow();

        Invitation invitation = new Invitation(chat, user);
        return invitationRepo.save(invitation);
    }

    @GetMapping
    public List<Invitation> getAllInvitations() {
        return invitationRepo.findAll();
    }
}

package com.sr03.chat_app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sr03.chat_app.dtos.InvitationDto;
import com.sr03.chat_app.models.Chat;
import com.sr03.chat_app.models.Invitation;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.repositories.ChatRepository;
import com.sr03.chat_app.repositories.InvitationRepository;
import com.sr03.chat_app.repositories.UserRepository;

import java.util.List;

@Service
public class InvitationService {
    @Autowired
    private InvitationRepository invitationRepository;
    private UserRepository userRepository;
    private ChatRepository chatRepository;

    public Invitation createInvitation(InvitationDto invitationDto) {
        int userId = invitationDto.getUserId();
        int chatId = invitationDto.getChatId();

        User user = getUserOrThrow(userId);
        Chat chat = getChatOrThrow(chatId);

        Invitation invitation = new Invitation(chat, user);
        return invitationRepository.save(invitation);
    }

    public List<Invitation> getAllInvitations() {
        return invitationRepository.findAll();
    }

    public void deleteInvitation(int id) {
        invitationRepository.deleteById(id);
    }

    public List<Invitation> getInvitationsByUserIdSent(int userId) {
        User user = getUserOrThrow(userId);
        return invitationRepository.findByUser(user);
    }

    public List<Invitation> getInvitationsByChatId(int chatId) {
        Chat chat = getChatOrThrow(chatId);
        return invitationRepository.findByChat(chat);
    }

    private User getUserOrThrow(int userId) {
        return userRepository.findById(userId)
                .orElseThrow(
                        () -> new IllegalArgumentException("L'utilisateur avec l'ID " + userId + " n'existe pas."));
    }

    private Chat getChatOrThrow(int chatId) {
        return chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Le chat avec l'ID " + chatId + " n'existe pas."));
    }
}

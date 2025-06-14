package com.sr03.chat_app.services;

import com.sr03.chat_app.dtos.ChatDto;
import com.sr03.chat_app.models.Chat;
import com.sr03.chat_app.models.Invitation;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.repositories.ChatRepository;
import com.sr03.chat_app.repositories.InvitationRepository;
import com.sr03.chat_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.HashSet;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvitationRepository invitationRepository;

    @Transactional
    public Chat createChat(ChatDto chatDto) {
        List<Integer> invitedUserIds = chatDto.getInvitedUserIds();
        if (invitedUserIds == null || invitedUserIds.isEmpty()) {
            throw new RuntimeException("Au moins un utilisateur doit être invité");
        }

        User creator = userRepository.findById(chatDto.getCreatorId())
                .orElseThrow(() -> new RuntimeException(
                        "Utilisateur (créateur) non trouvé avec l'id: " + chatDto.getCreatorId()));

        Chat chat = new Chat(
                chatDto.getTitle(),
                chatDto.getDescription(),
                chatDto.getDate(),
                chatDto.getDuration(),
                creator);

        for (Integer userId : chatDto.getInvitedUserIds()) {
            User invitedUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur invité non trouvé avec l'id: " + userId));
            chat.addInvitation(invitedUser);
        }

        return chatRepository.save(chat);
    }

    public List<Chat> getAllChats() {
        return chatRepository.findAll();
    }

    @Transactional
    public void deleteChat(Integer id, Integer userId) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat non trouvé avec l'id: " + id));

        if (chat.getCreator().getId() != userId) {
            throw new RuntimeException("Seul le créateur peut supprimer ce chat");
        }
        chatRepository.deleteById(id);
    }

    @Transactional
    public Chat updateChat(Integer id, ChatDto chatDto, Integer userId) {
        Chat chatToUpdate = chatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat non trouvé avec l'id: " + id));

        if (chatToUpdate.getCreator().getId() != userId) {
            throw new RuntimeException("Seul le créateur peut modifier ce chat");
        }

        chatToUpdate.setTitle(chatDto.getTitle());
        chatToUpdate.setDescription(chatDto.getDescription());
        chatToUpdate.setDate(chatDto.getDate());
        chatToUpdate.setDuration(chatDto.getDuration());

        List<Invitation> currentInvitations = new ArrayList<>(chatToUpdate.getInvitations());
        for (Invitation invitation : currentInvitations) {
            invitation.getUser().getInvitations().remove(invitation);
        }
        chatToUpdate.getInvitations().clear();

        chatRepository.flush();

        for (Integer invitedUserId : chatDto.getInvitedUserIds()) {
            User invitedUser = userRepository.findById(invitedUserId)
                    .orElseThrow(
                            () -> new RuntimeException("Utilisateur invité non trouvé avec l'id: " + invitedUserId));
            chatToUpdate.addInvitation(invitedUser);
        }

        return chatRepository.save(chatToUpdate);
    }

    @Transactional
    public void leaveChat(Integer chatId, Integer userId) {
        invitationRepository.deleteByChatIdAndUserId(chatId, userId);
    }

    @Transactional(readOnly = true)
    public Set<User> getChatParticipants(Integer chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat non trouvé avec l'id: " + chatId));

        Set<User> participants = new HashSet<>();
        participants.add(chat.getCreator());

        Set<User> invitedUsers = chat.getInvitations().stream()
                .map(Invitation::getUser)
                .collect(Collectors.toSet());

        participants.addAll(invitedUsers);

        return participants;
    }
}

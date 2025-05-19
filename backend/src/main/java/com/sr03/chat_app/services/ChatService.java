package com.sr03.chat_app.services;

import com.sr03.chat_app.dtos.ChatDto;
import com.sr03.chat_app.models.Chat;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.repositories.ChatRepository;
import com.sr03.chat_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

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

    public void deleteChat(Integer id) {
        if (!chatRepository.existsById(id)) {
            throw new RuntimeException("Chat non trouvé avec l'id: " + id);
        }
        chatRepository.deleteById(id);
    }

    public Chat updateChat(Integer id, ChatDto chatDto) {
        Chat chatToUpdate = chatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat non trouvé avec l'id: " + id));

        chatToUpdate.setTitle(chatDto.getTitle());
        chatToUpdate.setDescription(chatDto.getDescription());
        chatToUpdate.setDate(chatDto.getDate());
        chatToUpdate.setDuration(chatDto.getDuration());

        return chatRepository.save(chatToUpdate);
    }
}

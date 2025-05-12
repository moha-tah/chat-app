package com.sr03.chat_app.controllers;

import com.sr03.chat_app.dtos.ChatDTO;
import com.sr03.chat_app.models.Chat;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.repositories.ChatRepository;
import com.sr03.chat_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new Chat
    @PostMapping("/create")
    public Chat createChat(@RequestBody ChatDTO chatDTO) {
        // Ensure the creator exists before saving the chat
        User creator = userRepository.findById(chatDTO.getCreatorId())
                .orElseThrow(() -> new RuntimeException("Creator user not found"));

        // Create the new Chat object using ChatDTO values
        Chat chat = new Chat(
                chatDTO.getTitle(),
                chatDTO.getDescription(),
                chatDTO.getDateTime(),
                chatDTO.getDurationMinutes(),
                creator
        );

        // Save and return the newly created chat
        return chatRepository.save(chat);
    }

    // Get all Chats
    @GetMapping
    public List<ChatDTO> getAllChats() {
        return chatRepository.findAll().stream()
                .map(chat -> new ChatDTO(
                        chat.getTitle(),
                        chat.getDescription(),
                        chat.getDateTime(),
                        chat.getDurationMinutes(),
                        chat.getCreator().getId() // Add creatorId to the DTO
                ))
                .collect(Collectors.toList());
    }
}

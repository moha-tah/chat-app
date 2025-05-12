package com.sr03.chat_app.controllers;

import com.sr03.chat_app.models.Chat;
import com.sr03.chat_app.repositories.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("chats")
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;

    // Create a new Chat
    @PostMapping()
    public Chat createUser(@RequestBody Chat chat) {
        return chatRepository.save(chat);
    }

    // Get all Chats
    @GetMapping
    public List<Chat> getAllChats() {
        return chatRepository.findAll();
    }
}

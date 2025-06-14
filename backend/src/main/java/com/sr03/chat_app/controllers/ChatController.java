package com.sr03.chat_app.controllers;

import com.sr03.chat_app.dtos.ChatDto;
import com.sr03.chat_app.models.Chat;
import com.sr03.chat_app.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping()
    public Chat createChat(@RequestBody ChatDto chatDto) {
        return chatService.createChat(chatDto);
    }

    @GetMapping
    public List<Chat> getAllChats() {
        return chatService.getAllChats();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChat(@PathVariable Integer id, @RequestHeader("X-User-Id") Integer userId) {
        chatService.deleteChat(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public Chat updateChat(@PathVariable Integer id, @RequestBody ChatDto chatDto,
            @RequestHeader("X-User-Id") Integer userId) {
        return chatService.updateChat(id, chatDto, userId);
    }

    @PostMapping("/{chatId}/users/{userId}/leave")
    public ResponseEntity<Void> leaveChat(@PathVariable Integer chatId, @PathVariable Integer userId) {
        chatService.leaveChat(chatId, userId);
        return ResponseEntity.noContent().build();
    }
}

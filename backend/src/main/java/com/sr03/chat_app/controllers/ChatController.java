package com.sr03.chat_app.controllers;
import com.sr03.chat_app.dtos.ChatDto;
import com.sr03.chat_app.models.Chat;
import com.sr03.chat_app.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void deleteChat(@PathVariable Integer id) {
        chatService.deleteChat(id);
    }

    @PutMapping("/{id}")
    public Chat updateChat(@PathVariable Integer id, @RequestBody ChatDto chatDto) {
        return chatService.updateChat(id, chatDto);
    }
}




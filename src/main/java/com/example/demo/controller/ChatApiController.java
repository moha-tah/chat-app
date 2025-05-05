package com.example.demo.controller;
import com.example.demo.model.Chat;
import com.example.demo.model.User;
import com.example.demo.repository.chatdata;
import com.example.demo.repository.userdata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController

@RequestMapping("/api/chat")
public class ChatApiController {

    @Autowired
    private chatdata chatdatarepo;

    // Create a new Chat
    @PostMapping("/create")
    public Chat createUser(@RequestBody Chat Chat) {
        return chatdatarepo.save(Chat);
    }

    // Get all Chats
    @GetMapping
    public List<Chat> getAllChats() {
        return chatdatarepo.findAll();
    }

}







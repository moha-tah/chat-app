package com.sr03.chat_app.controllers;
import com.sr03.chat_app.dto.ChatResponseDTO;
import java.util.stream.Collectors;
import com.sr03.chat_app.models.Chat;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.repositories.ChatRepository;
import com.sr03.chat_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.sr03.chat_app.dto.ChatDTO;

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
        User creator = userRepository.findById(chatDTO.getCreatorId())
                .orElseThrow(() -> new RuntimeException("Creator user not found"));

        Chat chat = new Chat(
                chatDTO.getTitle(),
                chatDTO.getDescription(),
                chatDTO.getDateTime(),
                chatDTO.getDurationMinutes(),
                creator
        );

        return chatRepository.save(chat);
    }


    // Get all Chats

    @GetMapping
    public List<ChatResponseDTO> getAllChats() {
        return chatRepository.findAll().stream()
                .map(chat -> new ChatResponseDTO(
                        chat.getId(),
                        chat.getTitle(),
                        chat.getDescription(),
                        chat.getDateTime(),
                        chat.getDurationMinutes(),
                        chat.getCreator().getLastName() + " " + chat.getCreator().getFirstName()
                        // or getId() if preferred
                ))
                .collect(Collectors.toList());
    }
}

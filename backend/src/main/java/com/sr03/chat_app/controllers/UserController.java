package com.sr03.chat_app.controllers;

import com.sr03.chat_app.models.User;
import com.sr03.chat_app.repositories.UserRepository;
import com.sr03.chat_app.utils.Utils;
import com.sr03.chat_app.dtos.CreateUserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping()
    public User addUser(@RequestBody CreateUserDto createUserDto) {
        User user = createUser(createUserDto);
        return userRepository.save(user);
    }

    // Get all users
    @GetMapping()
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    private User createUser(CreateUserDto createUserDto) {
        String passwordSalt = UUID.randomUUID().toString();
        String passwordHash = Utils.hashPassword(createUserDto.getPassword(), passwordSalt);

        User user = new User(
                createUserDto.getLastName(),
                createUserDto.getFirstName(),
                createUserDto.getEmail(),
                passwordHash,
                passwordSalt,
                createUserDto.getIsAdmin());

        return userRepository.save(user);
    }
}

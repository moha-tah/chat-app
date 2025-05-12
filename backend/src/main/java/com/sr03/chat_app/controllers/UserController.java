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
        return createUser(createUserDto);
    }

    // Get all users
    @GetMapping()
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    private User createUser(CreateUserDto createUserDto) {
        // Check the strength of the password
        if (!Utils.isPasswordStrong(createUserDto.getPassword())) {
            throw new IllegalArgumentException(
                    "Password must be at least " + Utils.MIN_PASSWORD_LENGTH
                            + " characters long and must contains with " + Utils.MIN_SPECIAL_CHARACTERS
                            + " special characters, " + Utils.MIN_NUMBERS + " numbers and "
                            + Utils.MIN_UPPERCASE_LETTERS + " uppercase letters.");
        }

        // Check if a user with this email already exists
        if (userRepository.findByEmail(createUserDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("A user with this email already exists");
        }

        String passwordSalt = UUID.randomUUID().toString();
        String passwordHash = Utils.hashPassword(createUserDto.getPassword(), passwordSalt);

        User user = new User(
                createUserDto.getLastName(),
                createUserDto.getFirstName(),
                createUserDto.getEmail(),
                passwordHash,
                passwordSalt,
                false);

        return userRepository.save(user);
    }
}

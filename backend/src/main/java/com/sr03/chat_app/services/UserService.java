package com.sr03.chat_app.services;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sr03.chat_app.dtos.UserDto;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.repositories.UserRepository;
import com.sr03.chat_app.utils.Utils;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User addUser(UserDto createUserDto) {
        checkPasswordStrength(createUserDto.getPassword());

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
                createUserDto.isAdmin());

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(int id) {
        return getUserOrThrow(id);
    }

    public void deleteUser(int id) {
        checkUserExists(id);
        userRepository.deleteById(id);
    }

    public User updateUser(int id, UserDto userDto) {
        User user = getUserOrThrow(id);
        user.setLastName(userDto.getLastName());
        user.setFirstName(userDto.getFirstName());
        user.setEmail(userDto.getEmail());
        user.setActive(userDto.isActive());
        user.setAdmin(userDto.isAdmin());

        if (userDto.getPassword() != null) {
            checkPasswordStrength(userDto.getPassword());

            String passwordSalt = UUID.randomUUID().toString();
            String passwordHash = Utils.hashPassword(userDto.getPassword(), passwordSalt);
            user.setPasswordHash(passwordHash);
            user.setPasswordSalt(passwordSalt);
        }

        return userRepository.save(user);
    }

    public void activateUser(int id) {
        setUserIsActive(id, true);
    }

    public void deactivateUser(int id) {
        setUserIsActive(id, false);
    }

    private void setUserIsActive(int id, boolean isActive) {
        User user = getUserOrThrow(id);
        user.setActive(isActive);
        userRepository.save(user);
    }

    private void checkUserExists(int id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found");
        }
    }

    private User getUserOrThrow(int id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private void checkPasswordStrength(String password) {
        if (!Utils.isPasswordStrong(password)) {
            throw new IllegalArgumentException(
                    "Password must be at least " + Utils.MIN_PASSWORD_LENGTH
                            + " characters long and must contains with " + Utils.MIN_SPECIAL_CHARACTERS
                            + " special characters, " + Utils.MIN_NUMBERS + " numbers and "
                            + Utils.MIN_UPPERCASE_LETTERS + " uppercase letters.");
        }
    }
}

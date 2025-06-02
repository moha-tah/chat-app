package com.sr03.chat_app.services;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sr03.chat_app.dtos.LoginDto;
import com.sr03.chat_app.dtos.UserDto;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.repositories.UserRepository;
import com.sr03.chat_app.security.RequiresAdmin;
import com.sr03.chat_app.utils.Utils;
import com.sr03.chat_app.exceptions.DuplicateEmailException;
import com.sr03.chat_app.exceptions.InvalidCredentialsException;
import com.sr03.chat_app.exceptions.PasswordStrengthException;
import com.sr03.chat_app.exceptions.UserNotFoundException;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @RequiresAdmin
    public User addUser(UserDto createUserDto) {
        checkPasswordStrength(createUserDto.getPassword());

        if (userRepository.findByEmail(createUserDto.getEmail()).isPresent()) {
            throw new DuplicateEmailException("Un utilisateur avec cet email existe déjà.");
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

    @RequiresAdmin
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User login(LoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec cet email."));

        if (!Utils.verifyPassword(loginDto.getPassword(), user.getPasswordSalt(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Mot de passe incorrect.");
        }

        return user;
    }

    @RequiresAdmin
    public User getUserById(int id) {
        return getUserOrNull(id);
    }

    @RequiresAdmin
    public void deleteUser(int id) {
        checkUserExists(id);
        userRepository.deleteById(id);
    }

    @RequiresAdmin
    public User updateUser(int id, UserDto userDto) {
        User user = getUserOrThrow(id);
        user.setLastName(userDto.getLastName());
        user.setFirstName(userDto.getFirstName());
        user.setEmail(userDto.getEmail());
        user.setActive(userDto.isActive());
        user.setAdmin(userDto.isAdmin());

        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            checkPasswordStrength(userDto.getPassword());

            String passwordSalt = UUID.randomUUID().toString();
            String passwordHash = Utils.hashPassword(userDto.getPassword(), passwordSalt);
            user.setPasswordHash(passwordHash);
            user.setPasswordSalt(passwordSalt);
        }

        return userRepository.save(user);
    }

    @RequiresAdmin
    public void activateUser(int id) {
        setUserIsActive(id, true);
    }

    @RequiresAdmin
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
            throw new UserNotFoundException("L'utilisateur avec l'ID " + id + " n'existe pas.");
        }
    }

    private User getUserOrNull(int id) {
        return userRepository.findById(id).orElse(null);
    }

    private User getUserOrThrow(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("L'utilisateur avec l'ID " + id + " n'existe pas."));
    }

    private void checkPasswordStrength(String password) {
        if (!Utils.isPasswordStrong(password)) {
            throw new PasswordStrengthException(
                    "Le mot de passe doit contenir au moins " + Utils.MIN_PASSWORD_LENGTH
                            + " caractères, " + Utils.MIN_SPECIAL_CHARACTERS
                            + " caractères spéciaux, " + Utils.MIN_NUMBERS + " nombres and "
                            + Utils.MIN_UPPERCASE_LETTERS + " majuscules.");
        }
    }
}

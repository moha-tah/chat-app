package com.sr03.chat_app.controllers;

import com.sr03.chat_app.models.User;
import com.sr03.chat_app.services.UserService;
import com.sr03.chat_app.dtos.LoginDto;
import com.sr03.chat_app.dtos.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.sr03.chat_app.dtos.SignupDto;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping()
    public User addUser(@RequestBody UserDto createUserDto) {
        return userService.addUser(createUserDto);
    }

    @GetMapping()
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/active")
    public List<User> getAllActiveUsers() {
        return userService.getAllActiveUsers();
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginDto loginDto) {
        return userService.login(loginDto);
    }

    @PostMapping("/signup")
    public User signup(@RequestPart("userData") SignupDto signupDto,
            @RequestPart(value = "avatar", required = false) MultipartFile avatarFile) {
        return userService.signupUser(signupDto, avatarFile);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @RequestBody UserDto userDto) {
        return userService.updateUser(id, userDto);
    }

    @PatchMapping("/{id}/activate")
    public void activateUser(@PathVariable int id) {
        userService.activateUser(id);
    }

    @PatchMapping("/{id}/deactivate")
    public void deactivateUser(@PathVariable int id) {
        userService.deactivateUser(id);
    }

    @PostMapping("/{id}/avatar")
    public ResponseEntity<String> uploadAvatar(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = userService.storeAvatar(id, file);
            return ResponseEntity.ok(avatarUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            // 1. Check if header exists and is properly formatted
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // 2. Extract token (assuming it's the user's email)
            String token = authHeader.substring(7).trim();

            // 4. Get user by email
            User user = userService.getUserByEmail(token);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            // 5. Better error handling
            return ResponseEntity.badRequest().build();
        }
    }

}

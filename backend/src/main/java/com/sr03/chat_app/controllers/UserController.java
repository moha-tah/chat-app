package com.sr03.chat_app.controllers;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.services.UserService;
import com.sr03.chat_app.dtos.LoginDto;
import com.sr03.chat_app.dtos.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
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
    public User signup(@RequestPart("userData") SignupDto signupDto, @RequestPart(value = "avatar", required = false) MultipartFile avatarFile) {
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


}

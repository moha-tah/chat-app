package com.sr03.chat_app.controllers;

import com.sr03.chat_app.models.User;
import com.sr03.chat_app.services.UserService;
import com.sr03.chat_app.dtos.LoginDto;
import com.sr03.chat_app.dtos.UserDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}

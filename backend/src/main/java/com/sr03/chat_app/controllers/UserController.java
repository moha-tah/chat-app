package com.sr03.chat_app.controllers;

import com.sr03.chat_app.models.User;
import com.sr03.chat_app.services.UserService;
import com.sr03.chat_app.dtos.CreateUserDto;
import com.sr03.chat_app.dtos.UpdateUserDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping()
    public User addUser(@RequestBody CreateUserDto createUserDto) {
        return userService.addUser(createUserDto);
    }

    @GetMapping()
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @RequestBody UpdateUserDto updateUserDto) {
        return userService.updateUser(id, updateUserDto);
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

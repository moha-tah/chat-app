package com.example.demo.controller;
import com.example.demo.model.User;
import com.example.demo.repository.userdata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController

@RequestMapping("/api/user")
public class UserApiController {

    @Autowired
    private userdata UserRepo;

    // Create a new user
    @PostMapping("/create")
    public User createUser(@RequestBody User user) {
        return UserRepo.save(user);
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return UserRepo.findAll();
    }

}






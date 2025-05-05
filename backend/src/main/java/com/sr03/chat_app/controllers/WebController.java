package com.sr03.chat_app.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

//    @Autowired
//    private userdata userRepo; // Inject your repositories here

    @GetMapping("/admin")
    public String adminPage() {
        // Create a test user (just once – no duplication check here)
//        User user = new User("Doe", "John", "john.doe@example.com", "password123", false);
//        userRepo.save(user);

        return "admin"; // returns admin.html
    }

    @GetMapping("/user")
    public String userPage() {
        return "user";
    }
}

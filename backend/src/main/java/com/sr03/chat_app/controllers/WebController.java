package com.sr03.chat_app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.sr03.chat_app.services.UserService;

@Controller
@RequestMapping("/admin")
public class WebController {

    @Autowired
    private UserService userService;

    @GetMapping()
    public String homePage() {
        return "home";
    }

    @GetMapping("/users")
    public String usersPage(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "users";
    }

    @GetMapping("users/{id}")
    public String userPage(@PathVariable int id, Model model) {
        model.addAttribute("user", userService.getUserById(id));
        return "user";
    }

    @GetMapping("users/{id}/update")
    public String updateUserPage(@PathVariable int id, Model model) {
        model.addAttribute("user", userService.getUserById(id));
        return "update-user";
    }
}

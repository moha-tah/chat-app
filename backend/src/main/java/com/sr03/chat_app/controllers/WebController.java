package com.sr03.chat_app.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class WebController {

    @GetMapping()
    public String adminPage() {
        return "admin";
    }

    @GetMapping("/users")
    public String usersPage() {
        return "users";
    }

    @GetMapping("users/{id}")
    public String userPage(@PathVariable int id, Model model) {
        model.addAttribute("id", id);
        return "user";
    }

    @GetMapping("users/{id}/update")
    public String updateUserPage(@PathVariable int id, Model model) {
        model.addAttribute("id", id);
        return "update-user";
    }
}

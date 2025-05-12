package com.sr03.chat_app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sr03.chat_app.dtos.UserDto;
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
        return "list-users";
    }

    @GetMapping("users/create")
    public String createUserPage(Model model) {
        model.addAttribute("userDto", new UserDto());
        return "create-user";
    }

    @PostMapping("users/create")
    public String createUser(@ModelAttribute UserDto userDto, Model model, RedirectAttributes redirectAttributes) {
        try {
            userService.addUser(userDto);
            redirectAttributes.addFlashAttribute("successMessage",
                    "L'utilisateur " + userDto.getEmail() + " a bien été créé.");
            return "redirect:/admin/users";
        } catch (IllegalArgumentException e) {
            String errorMessage = e.getMessage();
            if (errorMessage.contains("mot de passe doit contenir")
                    || errorMessage.contains("email existe ")) {
                model.addAttribute("userDto", userDto);
                model.addAttribute("errorMessage", errorMessage);
                return "create-user";
            } else {
                throw e;
            }
        }
    }

    @GetMapping("users/{id}")
    public String userPage(@PathVariable int id, Model model) {
        model.addAttribute("user", userService.getUserById(id));
        return "see-user";
    }

    @GetMapping("users/{id}/update")
    public String updateUserPage(@PathVariable int id, Model model) {
        model.addAttribute("user", userService.getUserById(id));
        return "update-user";
    }

    @PostMapping("users/{id}/update")
    public String updateUser(@PathVariable int id, @ModelAttribute UserDto userDto,
            RedirectAttributes redirectAttributes) {
        userService.updateUser(id, userDto);
        redirectAttributes.addFlashAttribute("successMessage",
                "L'utilisateur " + userDto.getEmail() + " a bien été modifié.");
        return "redirect:/admin/users";
    }

    @GetMapping("users/{id}/delete-confirm")
    public String showDeleteConfirmPage(@PathVariable int id, Model model) {
        model.addAttribute("user", userService.getUserById(id));
        return "delete-user-confirm";
    }

    @PostMapping("users/{id}/delete")
    public String deleteUser(@PathVariable int id, RedirectAttributes redirectAttributes) {
        userService.deleteUser(id);
        redirectAttributes.addFlashAttribute("successMessage",
                "L'utilisateur avec l'ID " + id + " a bien été supprimé.");
        return "redirect:/admin/users";
    }
}

package com.sr03.chat_app.controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sr03.chat_app.dtos.LoginDto;
import com.sr03.chat_app.dtos.UserDto;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.security.UnauthorizedAdminAccessException;
import com.sr03.chat_app.services.UserService;

@Controller
@RequestMapping("/admin")
public class WebController {

    @Autowired
    private UserService userService;

    private void addCurrentUserToModel(HttpSession session, Model model) {
        Integer userId = (Integer) session.getAttribute("userId");
        User user = userService.getUserById(userId);
        model.addAttribute("currentUser", user);
    }

    @GetMapping()
    public String homePage(HttpSession session, Model model, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("userId") == null) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "Veuillez vous connecter pour accéder à cette page.");
            return "redirect:/admin/login";
        }
        addCurrentUserToModel(session, model);
        return "home";
    }

    @GetMapping("/login")
    public String loginPage(HttpSession session, Model model) {
        if (session.getAttribute("userId") != null) {
            return "redirect:/admin";
        }
        model.addAttribute("loginDto", new LoginDto());
        return "login";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute LoginDto loginDto, Model model, RedirectAttributes redirectAttributes,
            HttpSession httpSession) {
        try {
            User user = userService.login(loginDto);
            if (!user.isAdmin()) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "Vous devez être administrateur pour accéder à cette page.");
                return "redirect:/admin/login";
            }
            httpSession.setAttribute("userId", user.getId());
            httpSession.setAttribute("isAdmin", user.isAdmin());
            return "redirect:/admin";
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/admin/login";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session, RedirectAttributes redirectAttributes) {
        session.invalidate();
        redirectAttributes.addFlashAttribute("successMessage", "Vous avez été déconnecté avec succès.");
        return "redirect:/admin/login";
    }

    @GetMapping("/users")
    public String usersPage(Model model, RedirectAttributes redirectAttributes, HttpSession session) {
        try {
            if (session.getAttribute("userId") == null) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "Veuillez vous connecter pour accéder à cette page.");
                return "redirect:/admin/login";
            }
            addCurrentUserToModel(session, model);

            model.addAttribute("users", userService.getAllUsers());
            return "list-users";
        } catch (UnauthorizedAdminAccessException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/admin/login";
        }
    }

    @GetMapping("users/create")
    public String createUserPage(Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("userId") == null) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "Veuillez vous connecter pour accéder à cette page.");
            return "redirect:/admin/login";
        }
        addCurrentUserToModel(session, model);
        model.addAttribute("userDto", new UserDto());
        return "create-user";
    }

    @PostMapping("users/create")
    public String createUser(@ModelAttribute UserDto userDto, Model model, RedirectAttributes redirectAttributes,
            HttpSession session) {
        try {
            if (session.getAttribute("userId") == null) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "Veuillez vous connecter pour accéder à cette page.");
                return "redirect:/admin/login";
            }
            addCurrentUserToModel(session, model);

            userService.addUser(userDto);
            redirectAttributes.addFlashAttribute("successMessage",
                    "L'utilisateur " + userDto.getEmail() + " a bien été créé.");
            return "redirect:/admin/users";
        } catch (UnauthorizedAdminAccessException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/admin/login";
        } catch (IllegalArgumentException e) {
            String errorMessage = e.getMessage();
            if (errorMessage.contains("mot de passe doit contenir")
                    || errorMessage.contains("email existe ")) {
                model.addAttribute("userDto", userDto);
                model.addAttribute("errorMessage", errorMessage);
                return "create-user";
            } else {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "Une erreur inattendue est survenue: " + e.getMessage());
                return "redirect:/admin/users";
            }
        }
    }

    @GetMapping("users/{id}")
    public String userPage(@PathVariable int id, Model model, RedirectAttributes redirectAttributes,
            HttpSession session) {
        try {
            if (session.getAttribute("userId") == null) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "Veuillez vous connecter pour accéder à cette page.");
                return "redirect:/admin/login";
            }
            addCurrentUserToModel(session, model);

            User user = userService.getUserById(id);
            if (user == null) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "L'utilisateur avec l'ID " + id + " n'existe pas.");
                return "redirect:/admin/users";
            }
            model.addAttribute("user", user);
            return "see-user";
        } catch (UnauthorizedAdminAccessException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/admin/login";
        }
    }

    @GetMapping("users/{id}/update")
    public String updateUserPage(@PathVariable int id, Model model, RedirectAttributes redirectAttributes,
            HttpSession session) {
        try {
            if (session.getAttribute("userId") == null) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "Veuillez vous connecter pour accéder à cette page.");
                return "redirect:/admin/login";
            }
            addCurrentUserToModel(session, model);

            User user = userService.getUserById(id);
            if (user == null) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "L'utilisateur avec l'ID " + id + " n'existe pas.");
                return "redirect:/admin/users";
            }
            model.addAttribute("user", user);
            return "update-user";
        } catch (UnauthorizedAdminAccessException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/admin/login";
        }
    }

    @PostMapping("users/{id}/update")
    public String updateUser(@PathVariable int id, Model model, @ModelAttribute UserDto userDto,
            RedirectAttributes redirectAttributes, HttpSession session) {
        try {
            if (session.getAttribute("userId") == null) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "Veuillez vous connecter pour accéder à cette page.");
                return "redirect:/admin/login";
            }
            addCurrentUserToModel(session, model);

            userService.updateUser(id, userDto);
            redirectAttributes.addFlashAttribute("successMessage",
                    "L'utilisateur " + userDto.getEmail() + " a bien été modifié.");
            return "redirect:/admin/users";
        } catch (UnauthorizedAdminAccessException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/admin/login";
        } catch (IllegalArgumentException e) {
            String errorMessage = e.getMessage();
            User existingUser = userService.getUserById(id);

            if (existingUser != null) {
                model.addAttribute("user", existingUser);
            } else {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "L'utilisateur avec l'ID " + id + " n'existe pas.");
                return "redirect:/admin/users";
            }
            model.addAttribute("userDto", userDto);
            model.addAttribute("errorMessage", errorMessage);

            if (errorMessage.contains("mot de passe doit contenir")
                    || errorMessage.contains("email existe ")) {
                return "update-user";
            } else if (errorMessage.contains("L'utilisateur avec l'ID " + id + " n'existe pas.")) {
                redirectAttributes.addFlashAttribute("errorMessage", errorMessage);
                return "redirect:/admin/users";
            } else {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "Une erreur technique est survenue lors de la mise à jour: " + e.getMessage());
                return "update-user";
            }
        }
    }

    @GetMapping("users/{id}/delete-confirm")
    public String showDeleteConfirmPage(@PathVariable int id, Model model, RedirectAttributes redirectAttributes,
            HttpSession session) {
        try {
            if (session.getAttribute("userId") == null) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "Veuillez vous connecter pour accéder à cette page.");
                return "redirect:/admin/login";
            }
            addCurrentUserToModel(session, model);

            User user = userService.getUserById(id);
            if (user == null) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "L'utilisateur avec l'ID " + id + " n'existe pas.");
                return "redirect:/admin/users";
            }
            model.addAttribute("user", user);
            return "delete-user-confirm";
        } catch (UnauthorizedAdminAccessException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/admin/login";
        }
    }

    @PostMapping("users/{id}/delete")
    public String deleteUser(@PathVariable int id, Model model, RedirectAttributes redirectAttributes,
            HttpSession session) {
        try {
            if (session.getAttribute("userId") == null) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "Veuillez vous connecter pour accéder à cette page.");
                return "redirect:/admin/login";
            }
            addCurrentUserToModel(session, model);

            userService.deleteUser(id);
            redirectAttributes.addFlashAttribute("successMessage",
                    "L'utilisateur avec l'ID " + id + " a bien été supprimé.");
            return "redirect:/admin/users";
        } catch (UnauthorizedAdminAccessException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/admin/login";
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/admin/users";
        }
    }
}

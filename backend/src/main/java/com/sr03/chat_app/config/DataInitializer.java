package com.sr03.chat_app.config;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.utils.Utils;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.sr03.chat_app.repositories.UserRepository;
import java.util.UUID;
@Configuration
public class DataInitializer {

    @Bean
    public ApplicationRunner init(UserRepository userRepository) {
        System.out.println("The Admin Function");

        return args -> {
            if (userRepository.count() == 0) {
                String password = "Admin@123"; // choose a strong password
                String salt = UUID.randomUUID().toString();
                String hashedPassword = Utils.hashPassword(password, salt);

                User admin = new User(
                        "Admin",
                        "Super",
                        "admin@chatapp.com",
                        hashedPassword,
                        salt,
                        true // isAdmin
                );
                admin.setActive(true);
                userRepository.save(admin);

                System.out.println("Initial admin created with email 'admin@chatapp.com' and password 'Admin@123'");
            }
        };
    }
}





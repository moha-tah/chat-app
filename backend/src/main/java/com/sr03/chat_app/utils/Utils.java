package com.sr03.chat_app.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

@Repository
public class Utils {
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public static String hashPassword(String password, String salt) {
        return passwordEncoder.encode(password + salt);
    }

    public static boolean verifyPassword(String password, String salt, String hashedPassword) {
        return passwordEncoder.matches(password + salt, hashedPassword);
    }
}

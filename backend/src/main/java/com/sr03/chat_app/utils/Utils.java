package com.sr03.chat_app.utils;

import org.springframework.stereotype.Repository;

import at.favre.lib.crypto.bcrypt.BCrypt;

@Repository
public class Utils {
    public static String hashPassword(String password, String salt) {
        return BCrypt.withDefaults().hashToString(12, (password + salt).toCharArray());
    }

    public static boolean verifyPassword(String password, String salt, String hashedPassword) {
        return BCrypt.verifyer().verify((password + salt).toCharArray(), hashedPassword.toCharArray()).verified;
    }
}

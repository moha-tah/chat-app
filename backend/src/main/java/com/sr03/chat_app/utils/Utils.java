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

    public static final int MIN_PASSWORD_LENGTH = 13;
    public static final int MIN_SPECIAL_CHARACTERS = 2;
    public static final int MIN_NUMBERS = 3;
    public static final int MIN_UPPERCASE_LETTERS = 2;

    public static boolean isPasswordStrong(String password) {
        if (password.length() < MIN_PASSWORD_LENGTH) {
            return false;
        }

        int uppercaseLettersCount = 0;
        int numbersCount = 0;
        int specialCharactersCount = 0;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                uppercaseLettersCount++;
            } else if (Character.isDigit(c)) {
                numbersCount++;
            } else if (!Character.isLetter(c)) {
                specialCharactersCount++;
            }
        }

        return specialCharactersCount >= MIN_SPECIAL_CHARACTERS
                && numbersCount >= MIN_NUMBERS
                && uppercaseLettersCount >= MIN_UPPERCASE_LETTERS;
    }
}

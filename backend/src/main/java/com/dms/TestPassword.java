package com.dms;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPassword {
    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // 🔥 Generate a correct BCrypt hash
        String newHash = encoder.encode("password123");

        System.out.println("Generated Hash: " + newHash);
    }
}
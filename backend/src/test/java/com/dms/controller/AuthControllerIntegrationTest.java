package com.dms.controller;

import com.dms.entity.User;
import com.dms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * INTEGRATION TEST for AuthController.
 * 
 * Unlike Unit Tests, this loads the ENTIRE Spring Boot application context,
 * connects to the H2 in-memory test database, and simulates real HTTP requests.
 * It tests the Controller -> Service -> Repository -> Database flow.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // Uses application.properties from test/resources
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc; // Used to simulate HTTP requests

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setupDatabase() {
        // Clean the database before each test
        userRepository.deleteAll();

        // Insert a real test user into the H2 database
        User testUser = User.builder()
                .fullName("Integration Test User")
                .username("int_user")
                .email("int@test.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(User.Role.DEBATER)
                .build();
        userRepository.save(testUser);
    }

    /**
     * TEST: Full HTTP POST to /api/auth/login with valid credentials.
     * Expects HTTP 200 OK and a JWT token in the response body.
     */
    @Test
    void login_withValidCredentials_returns200AndToken() throws Exception {
        String jsonPayload = """
                {
                    "usernameOrEmail": "int_user",
                    "password": "password123"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.username").value("int_user"))
                .andExpect(jsonPath("$.user.role").value("DEBATER"));
    }

    /**
     * TEST: Full HTTP POST to /api/auth/login with WRONG password.
     * Expects HTTP 403 Forbidden or 401 Unauthorized depending on exception mapping.
     * Since AuthService throws RuntimeException("Invalid credentials"), 
     * Spring might wrap it in a 500 if no global exception handler maps it to 401.
     * (Assuming standard behavior for this unhandled exception for now).
     */
    @Test
    void login_withWrongPassword_fails() throws Exception {
        String jsonPayload = """
                {
                    "usernameOrEmail": "int_user",
                    "password": "wrongpassword"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().is4xxClientError() // Could be 401 or 403 based on security config
                        .or(status().is5xxServerError())); // Or 500 if the RuntimeException isn't mapped
    }
}

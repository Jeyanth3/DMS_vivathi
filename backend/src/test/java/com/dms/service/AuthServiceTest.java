package com.dms.service;

import com.dms.dto.AuthRequest;
import com.dms.dto.AuthResponse;
import com.dms.dto.SignupRequest;
import com.dms.entity.User;
import com.dms.repository.DebaterStatsRepository;
import com.dms.repository.JudgeStatsRepository;
import com.dms.repository.UserRepository;
import com.dms.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService.
 *
 * These are UNIT tests — no database, no network, no Spring context.
 * All dependencies (UserRepository, PasswordEncoder, JwtUtil) are mocked
 * using Mockito. Each test runs in milliseconds.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    // ── Mocked dependencies ───────────────────────────────────────────────
    @Mock private UserRepository userRepository;
    @Mock private DebaterStatsRepository debaterStatsRepository;
    @Mock private JudgeStatsRepository judgeStatsRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    // AuthService with mocks injected automatically by Mockito
    @InjectMocks
    private AuthService authService;

    // A reusable test user object
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .fullName("Test Debater")
                .username("debater1")
                .email("debater1@test.com")
                .passwordHash("$2a$10$hashed_password")
                .role(User.Role.DEBATER)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────
    // LOGIN TESTS
    // ─────────────────────────────────────────────────────────────────────

    /**
     * TEST 1: Valid login by username should return a token and user.
     *
     * Simulates: user exists, password matches → login succeeds.
     */
    @Test
    void login_withValidUsername_returnsTokenAndUser() {
        // ARRANGE — set up what the mocks return
        AuthRequest request = new AuthRequest();
        request.setUsernameOrEmail("debater1");
        request.setPassword("password123");

        when(userRepository.findByUsername("debater1"))
                .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", testUser.getPasswordHash()))
                .thenReturn(true);  // password is correct
        when(jwtUtil.generateToken("debater1", "DEBATER"))
                .thenReturn("mock-jwt-token");

        // ACT — call the real method
        AuthResponse response = authService.login(request);

        // ASSERT — check the result
        assertNotNull(response, "Response should not be null");
        assertEquals("mock-jwt-token", response.getToken(), "Token should match");
        assertEquals("debater1", response.getUser().getUsername(), "Username should match");
        assertEquals("DEBATER", response.getUser().getRole(), "Role should be DEBATER");
    }

    /**
     * TEST 2: Valid login by email should also work.
     *
     * AuthService tries username first, then falls back to email.
     */
    @Test
    void login_withValidEmail_returnsTokenAndUser() {
        // ARRANGE
        AuthRequest request = new AuthRequest();
        request.setUsernameOrEmail("debater1@test.com");
        request.setPassword("password123");

        // Username lookup fails → falls back to email
        when(userRepository.findByUsername("debater1@test.com"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("debater1@test.com"))
                .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", testUser.getPasswordHash()))
                .thenReturn(true);
        when(jwtUtil.generateToken("debater1", "DEBATER"))
                .thenReturn("mock-jwt-token");

        // ACT
        AuthResponse response = authService.login(request);

        // ASSERT
        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
    }

    /**
     * TEST 3: Wrong password should throw RuntimeException with "Invalid credentials".
     */
    @Test
    void login_withWrongPassword_throwsException() {
        // ARRANGE
        AuthRequest request = new AuthRequest();
        request.setUsernameOrEmail("debater1");
        request.setPassword("wrongpassword");

        when(userRepository.findByUsername("debater1"))
                .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", testUser.getPasswordHash()))
                .thenReturn(false); // password does NOT match

        // ACT & ASSERT — expect an exception to be thrown
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(request),
                "Should throw exception for wrong password");

        assertEquals("Invalid credentials", ex.getMessage());
    }

    /**
     * TEST 4: Non-existent user should throw RuntimeException.
     */
    @Test
    void login_withNonExistentUser_throwsException() {
        // ARRANGE
        AuthRequest request = new AuthRequest();
        request.setUsernameOrEmail("nobody");
        request.setPassword("password123");

        when(userRepository.findByUsername("nobody"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("nobody"))
                .thenReturn(Optional.empty()); // user does not exist

        // ACT & ASSERT
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(request));

        assertEquals("Invalid credentials", ex.getMessage());
    }

    // ─────────────────────────────────────────────────────────────────────
    // SIGNUP TESTS
    // ─────────────────────────────────────────────────────────────────────

    /**
     * TEST 5: Valid signup creates a user and returns a token.
     *
     * Also verifies that DebaterStats are auto-created for DEBATER role.
     */
    @Test
    void signup_withValidData_returnsTokenAndCreatesStats() {
        // ARRANGE
        SignupRequest request = new SignupRequest();
        request.setFullName("New Debater");
        request.setUsername("newdebater");
        request.setEmail("new@test.com");
        request.setPassword("password123");
        request.setRole(User.Role.DEBATER);

        when(userRepository.existsByUsername("newdebater")).thenReturn(false);
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$10$encoded");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(debaterStatsRepository.save(any())).thenReturn(null);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("new-token");

        // ACT
        AuthResponse response = authService.signup(request);

        // ASSERT
        assertNotNull(response);
        assertEquals("new-token", response.getToken());

        // Verify DebaterStats were created (side effect of DEBATER signup)
        verify(debaterStatsRepository, times(1)).save(any());
        verify(judgeStatsRepository, never()).save(any()); // JudgeStats NOT created
    }

    /**
     * TEST 6: Signup with a taken username should throw exception.
     */
    @Test
    void signup_withDuplicateUsername_throwsException() {
        // ARRANGE
        SignupRequest request = new SignupRequest();
        request.setUsername("debater1"); // already taken
        request.setEmail("unique@test.com");
        request.setPassword("password123");
        request.setRole(User.Role.DEBATER);

        when(userRepository.existsByUsername("debater1")).thenReturn(true); // duplicate!

        // ACT & ASSERT
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.signup(request));

        assertEquals("Username already taken", ex.getMessage());

        // Verify that save() was NEVER called — user was not created
        verify(userRepository, never()).save(any());
    }

    /**
     * TEST 7: Signup with a taken email should throw exception.
     */
    @Test
    void signup_withDuplicateEmail_throwsException() {
        // ARRANGE
        SignupRequest request = new SignupRequest();
        request.setUsername("uniqueuser");
        request.setEmail("debater1@test.com"); // already registered
        request.setPassword("password123");
        request.setRole(User.Role.DEBATER);

        when(userRepository.existsByUsername("uniqueuser")).thenReturn(false);
        when(userRepository.existsByEmail("debater1@test.com")).thenReturn(true); // duplicate!

        // ACT & ASSERT
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.signup(request));

        assertEquals("Email already registered", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────────────────────────────
    // GET ME TEST
    // ─────────────────────────────────────────────────────────────────────

    /**
     * TEST 8: getMe() should return user details for the authenticated user.
     *
     * Called when frontend hits GET /api/auth/me with a valid JWT.
     */
    @Test
    void getMe_withValidUsername_returnsUserDTO() {
        // ARRANGE
        when(userRepository.findByUsername("debater1"))
                .thenReturn(Optional.of(testUser));

        // ACT
        var userDTO = authService.getMe("debater1");

        // ASSERT
        assertNotNull(userDTO);
        assertEquals("debater1", userDTO.getUsername());
        assertEquals("DEBATER", userDTO.getRole());
    }

    /**
     * TEST 9: getMe() with unknown username should throw exception.
     */
    @Test
    void getMe_withUnknownUsername_throwsException() {
        // ARRANGE
        when(userRepository.findByUsername("ghost"))
                .thenReturn(Optional.empty());

        // ACT & ASSERT
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.getMe("ghost"));

        assertEquals("User not found", ex.getMessage());
    }
}

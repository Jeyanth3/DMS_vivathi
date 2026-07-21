package com.dms.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for JwtUtil.
 *
 * Tests token generation, extraction, and validation
 * without any Spring context — pure Java logic tests.
 */
class JwtUtilTest {

    private JwtUtil jwtUtil;

    // A safe 256-bit secret (32+ characters) for tests only
    private static final String TEST_SECRET =
            "test-secret-key-for-vivaathi-dms-system-2024-secure";
    private static final long TEST_EXPIRY = 3600000L; // 1 hour in ms

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // Inject @Value fields manually (no Spring context needed)
        ReflectionTestUtils.setField(jwtUtil, "secret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtUtil, "expiration", TEST_EXPIRY);
    }

    /**
     * TEST 1: generateToken should produce a non-null, non-empty JWT string.
     */
    @Test
    void generateToken_returnsNonNullToken() {
        String token = jwtUtil.generateToken("debater1", "DEBATER");

        assertNotNull(token, "Token should not be null");
        assertFalse(token.isBlank(), "Token should not be blank");
        // JWT format: 3 base64 parts separated by dots
        assertEquals(3, token.split("\\.").length,
                "JWT should have 3 parts (header.payload.signature)");
    }

    /**
     * TEST 2: extractUsername should return the username embedded in the token.
     */
    @Test
    void extractUsername_returnsCorrectUsername() {
        String token = jwtUtil.generateToken("judge1", "JUDGE");

        String extractedUsername = jwtUtil.extractUsername(token);

        assertEquals("judge1", extractedUsername,
                "Extracted username should match the one used to generate the token");
    }

    /**
     * TEST 3: validateToken should return true for a freshly generated token.
     */
    @Test
    void validateToken_withValidToken_returnsTrue() {
        String token = jwtUtil.generateToken("organizer1", "ORGANIZER");

        boolean isValid = jwtUtil.validateToken(token);

        assertTrue(isValid, "A freshly generated token should be valid");
    }

    /**
     * TEST 4: validateToken should return false for a tampered token.
     *
     * Changing even one character of the signature invalidates it.
     */
    @Test
    void validateToken_withTamperedToken_returnsFalse() {
        String token = jwtUtil.generateToken("debater1", "DEBATER");

        // Tamper with the last character of the signature part
        String tamperedToken = token.substring(0, token.length() - 4) + "XXXX";

        boolean isValid = jwtUtil.validateToken(tamperedToken);

        assertFalse(isValid, "A tampered token should be rejected");
    }

    /**
     * TEST 5: validateToken should return false for a completely random string.
     */
    @Test
    void validateToken_withGarbageToken_returnsFalse() {
        boolean isValid = jwtUtil.validateToken("not.a.valid.jwt.token");

        assertFalse(isValid, "A garbage string is not a valid token");
    }

    /**
     * TEST 6: validateToken should return false for an empty string.
     */
    @Test
    void validateToken_withEmptyString_returnsFalse() {
        boolean isValid = jwtUtil.validateToken("");

        assertFalse(isValid, "An empty string is not a valid token");
    }

    /**
     * TEST 7: Tokens for different users should be different.
     */
    @Test
    void generateToken_differentUsersGetDifferentTokens() {
        String token1 = jwtUtil.generateToken("debater1", "DEBATER");
        String token2 = jwtUtil.generateToken("judge1", "JUDGE");

        assertNotEquals(token1, token2,
                "Different users should have different tokens");
    }

    /**
     * TEST 8: Token generated with a different secret should fail validation.
     *
     * This simulates what happens if someone tries to forge a token
     * with a different secret key.
     */
    @Test
    void validateToken_withTokenFromDifferentSecret_returnsFalse() {
        // Generate token with a different JwtUtil (different secret)
        JwtUtil differentSecretUtil = new JwtUtil();
        ReflectionTestUtils.setField(differentSecretUtil, "secret",
                "completely-different-secret-key-that-is-long-enough-here");
        ReflectionTestUtils.setField(differentSecretUtil, "expiration", TEST_EXPIRY);

        String foreignToken = differentSecretUtil.generateToken("attacker", "ADMIN");

        // Validate with our JwtUtil — should FAIL because signature doesn't match
        boolean isValid = jwtUtil.validateToken(foreignToken);

        assertFalse(isValid, "A token signed with a different secret should be rejected");
    }
}

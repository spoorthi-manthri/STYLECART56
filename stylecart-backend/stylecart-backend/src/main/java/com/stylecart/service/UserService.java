
package com.stylecart.service;

import com.stylecart.entity.User;
import com.stylecart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {

        // Remove spaces from the beginning and end
        String email = user.getEmail().trim();

        // Store emails in lowercase for consistent duplicate checking
        email = email.toLowerCase(java.util.Locale.ROOT);
        user.setEmail(email);

        // Check whether the email is already registered
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Assign the default customer role
        user.setRole("CUSTOMER");

        return userRepository.save(user);
    }

    public User login(String email, String rawPassword) {

        // Find the customer using their email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid email or password"));

        // Compare the entered password with the stored BCrypt hash
        boolean passwordMatches =
                passwordEncoder.matches(rawPassword, user.getPassword());

        // Reject incorrect passwords
        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Return the authenticated user
        return user;
    }

}

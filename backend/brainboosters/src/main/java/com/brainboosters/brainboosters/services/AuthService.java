package com.brainboosters.brainboosters.services;

import com.brainboosters.brainboosters.models.User;
import com.brainboosters.brainboosters.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Find or create user
    public User findOrCreateUser(String email, String username, String profilePictureUrl) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            // If the user does not exist, create a new one
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setProfilePicture(profilePictureUrl);
            return userRepository.save(newUser);
        }
        return existingUser;  // Return the existing user
    }

    // Get user by ID
    public User getUserById(String id) {  // Change Long to String
        Optional<User> userOptional = userRepository.findById(id);  // Use String for the ID
        if (userOptional.isPresent()) {
            return userOptional.get();
        }
        throw new RuntimeException("User not found with id: " + id);  // You can customize this exception as needed
    }

    // Update user profile
    public User updateUserProfile(String id, User updatedUser) {  // Change Long to String
        Optional<User> userOptional = userRepository.findById(id);  // Use String for the ID
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUsername(updatedUser.getUsername());
            user.setProfilePicture(updatedUser.getProfilePicture());
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setEmail(updatedUser.getEmail());
            user.setPassword(updatedUser.getPassword()); // Optionally update password
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found with id: " + id);  // You can customize this exception as needed
    }
}

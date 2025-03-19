package com.brainboosters.brainboosters.services;

import com.brainboosters.brainboosters.models.User;
import com.brainboosters.brainboosters.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private static final Map<String, Set<String>> userFollowers = new HashMap<>(); // To track followers (user -> set of followers)

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get user by ID
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null); // MongoDB uses String for ID
    }

    // Create new user
    public User createUser(User user) {
        return userRepository.save(user); // Save user to MongoDB
    }

    // Update existing user
    public User updateUser(String id, User user) {
        if (userRepository.existsById(id)) {
            user.setId(id);
            return userRepository.save(user); // Save updated user
        }
        return null; // or throw an exception if user not found
    }

    // Delete user
    public void deleteUser(String id) {
        userRepository.deleteById(id);
        userFollowers.remove(id); // Remove followers info when deleting the user
        // Remove the user from other users' followers sets
        for (Set<String> followers : userFollowers.values()) {
            followers.remove(id);
        }
    }

    // Follow a user
    public void followUser(String userId, String followId) {
        // Check if both users exist before following
        if (!userRepository.existsById(userId) || !userRepository.existsById(followId)) {
            throw new RuntimeException("User(s) not found with ID(s): " + userId + ", " + followId);
        }

        // Add followId to the set of followers for userId
        userFollowers.putIfAbsent(userId, new HashSet<>());
        userFollowers.get(userId).add(followId);
    }

    // Unfollow a user
    public void unfollowUser(String userId, String unfollowId) {
        // Check if both users exist before unfollowing
        if (!userRepository.existsById(userId) || !userRepository.existsById(unfollowId)) {
            throw new RuntimeException("User(s) not found with ID(s): " + userId + ", " + unfollowId);
        }

        // Remove unfollowId from the set of followers for userId
        Set<String> followers = userFollowers.get(userId);
        if (followers != null) {
            followers.remove(unfollowId);
        }
    }

    // Get followers of a user
    public Set<String> getFollowers(String userId) {
        return userFollowers.getOrDefault(userId, new HashSet<>());
    }
}

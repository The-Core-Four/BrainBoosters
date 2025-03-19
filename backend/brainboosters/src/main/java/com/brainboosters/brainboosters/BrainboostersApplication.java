package com.brainboosters.brainboosters;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import com.brainboosters.brainboosters.models.User;
import com.brainboosters.brainboosters.services.UserService;

import java.util.Set;

@SpringBootApplication
@RestController
public class BrainboostersApplication {

    private final UserService userService;

    public BrainboostersApplication(UserService userService) {
        this.userService = userService;
    }

    public static void main(String[] args) {
        SpringApplication.run(BrainboostersApplication.class, args);
    }


    @GetMapping("/")
    public String rootEndpoint() {
        return "Hello Welcome to the Brain Boosters!";
    }

    // New greet endpoint
    @GetMapping("/greet/{name}")
    public String greet(@PathVariable String name, @RequestParam(required = false) String message) {
        if (message != null && !message.isEmpty()) {
            return "Hello " + name + "! " + message;
        }
        return "Hello " + name + "! Welcome to Spring Boot!";
    }

    // Create a new user
    @PostMapping("/user")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(201).body(createdUser);
    }

    // Delete user
    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User with ID " + id + " deleted successfully!");
    }

    // Follow a user
    @PostMapping("/user/{userId}/follow/{followId}")
    public ResponseEntity<String> followUser(@PathVariable String userId, @PathVariable String followId) {
        try {
            userService.followUser(userId, followId);
            return ResponseEntity.ok("User " + userId + " is now following user " + followId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Unfollow a user
    @DeleteMapping("/user/{userId}/unfollow/{unfollowId}")
    public ResponseEntity<String> unfollowUser(@PathVariable String userId, @PathVariable String unfollowId) {
        try {
            userService.unfollowUser(userId, unfollowId);
            return ResponseEntity.ok("User " + userId + " has unfollowed user " + unfollowId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get followers of a user
    @GetMapping("/user/{userId}/followers")
    public ResponseEntity<Set<String>> getFollowers(@PathVariable String userId) {
        Set<String> followers = userService.getFollowers(userId);
        return ResponseEntity.ok(followers);
    }
}

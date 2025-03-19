package com.brainboosters.brainboosters.controllers;

import com.brainboosters.brainboosters.models.User;
import com.brainboosters.brainboosters.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    // Endpoint to retrieve a user's profile (by user ID)
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable String id) { // Change id type to String
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    // Endpoint to update user profile details (name, profile picture, etc.)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserProfile(@PathVariable String id, @RequestBody User updatedUser) { // Change id type to String
        if (updatedUser.getFirstName() == null || updatedUser.getFirstName().isEmpty() || 
            updatedUser.getLastName() == null || updatedUser.getLastName().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        User updated = userService.updateUser(id, updatedUser);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}

package com.brainboosters.brainboosters.controllers;

import com.brainboosters.brainboosters.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/follow")
public class FollowController {

    @Autowired
    private UserService userService;

    // Follow a user
    @PostMapping("/{userId}/follow/{followId}")
    public ResponseEntity<String> followUser(@PathVariable String userId, @PathVariable String followId) { // Change Long to String
        try {
            userService.followUser(userId, followId);  // Ensure this method is implemented in the UserService
            return new ResponseEntity<>("User followed successfully", HttpStatus.OK);
        } catch (Exception e) {
            // Handle any specific exceptions or user not found cases
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Unfollow a user
    @DeleteMapping("/{userId}/unfollow/{unfollowId}")
    public ResponseEntity<String> unfollowUser(@PathVariable String userId, @PathVariable String unfollowId) { // Change Long to String
        try {
            userService.unfollowUser(userId, unfollowId);  // Ensure this method is implemented in the UserService
            return new ResponseEntity<>("User unfollowed successfully", HttpStatus.OK);
        } catch (Exception e) {
            // Handle any specific exceptions or user not found cases
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}

package com.example.pafbackend.controllers;

import com.example.pafbackend.models.UserConnection;
import com.example.pafbackend.repositories.UserConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/userConnections") // Define the base URL for user connection endpoints
public class UserConnectionController {

    private final UserConnectionRepository userConnectionRepository; // Inject the repository for user connections

    // Constructor-based dependency injection for userConnectionRepository
    @Autowired
    public UserConnectionController(UserConnectionRepository userConnectionRepository) {
        this.userConnectionRepository = userConnectionRepository;
    }

    // Endpoint to fetch user connections by userId
    @GetMapping("/{userId}")
    public ResponseEntity<UserConnection> getUserConnections(@PathVariable String userId) {
        // Fetch user connection details from the repository based on userId
        UserConnection userConnection = userConnectionRepository.findByUserId(userId);
        
        if (userConnection != null) {
            // Return the user connection data with HTTP 200 (OK) if found
            return new ResponseEntity<>(userConnection, HttpStatus.OK);
        } else {
            // Return HTTP 404 (Not Found) if no user connection is found for the provided userId
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to create or update user connections
    @PostMapping
    public ResponseEntity<UserConnection> createUserConnection(@RequestBody UserConnection userConnection) {
        // Check if a user connection document already exists for the provided userId
        UserConnection existingConnection = userConnectionRepository.findByUserId(userConnection.getUserId());
        
        if (existingConnection != null) {
            // If the user already has connections, update their friendIds by adding new ones
            List<String> currentFriendIds = existingConnection.getFriendIds();
            List<String> newFriendIds = userConnection.getFriendIds();
            currentFriendIds.addAll(newFriendIds); // Add the new friendIds to the existing list
            existingConnection.setFriendIds(currentFriendIds);
            
            // Save the updated user connection and return with HTTP 200 (OK)
            UserConnection updatedConnection = userConnectionRepository.save(existingConnection);
            return new ResponseEntity<>(updatedConnection, HttpStatus.OK);
        } else {
            // If no existing document, create a new user connection and save it to the database
            UserConnection savedUserConnection = userConnectionRepository.save(userConnection);
            return new ResponseEntity<>(savedUserConnection, HttpStatus.CREATED); // Return HTTP 201 (Created)
        }
    }

    // Endpoint to remove a friend from a user's connection list
    @DeleteMapping("/{userId}/friends/{friendId}")
    public ResponseEntity<Void> unfriend(@PathVariable String userId, @PathVariable String friendId) {
        // Check if the user connection document exists
        UserConnection existingConnection = userConnectionRepository.findByUserId(userId);
        
        if (existingConnection != null) {
            // If the user has existing friends, remove the specified friendId from the list
            List<String> currentFriendIds = existingConnection.getFriendIds();
            currentFriendIds.remove(friendId); // Remove the friendId from the list of friends
            existingConnection.setFriendIds(currentFriendIds);
            
            // Save the updated user connection after removing the friend
            userConnectionRepository.save(existingConnection);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Return HTTP 204 (No Content) on successful unfriend operation
        } else {
            // If no document exists for the provided userId, return HTTP 404 (Not Found)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

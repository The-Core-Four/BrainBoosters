package com.example.pafbackend.controllers;

import com.example.pafbackend.config.TokenGenerator;
import com.example.pafbackend.dto.LoginDTO;
import com.example.pafbackend.dto.SignupDTO;
import com.example.pafbackend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Allow cross-origin requests from React app (localhost:3000)
@RequestMapping("/api/auth") // Define the base URL for authentication endpoints
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class); // Logger for logging authentication-related messages
    
    @Autowired
    UserDetailsManager userDetailsManager; // Inject UserDetailsManager to manage user details in the system
    
    @Autowired
    TokenGenerator tokenGenerator; // Inject TokenGenerator to generate JWT tokens
    
    @Autowired
    DaoAuthenticationProvider daoAuthenticationProvider; // Inject DaoAuthenticationProvider to authenticate users

    // Endpoint for user registration
    @PostMapping("/register")
    public ResponseEntity register(@RequestBody SignupDTO signupDTO) {
        try {
            // Create a new user object and set the username and password from the SignupDTO
            User user = new User();
            user.setUsername(signupDTO.getUsername());
            user.setPassword(signupDTO.getPassword());
            
            // Create the user in the system
            userDetailsManager.createUser(user);
            
            // Authenticate the user and generate a token
            Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(user, signupDTO.getPassword(), Collections.EMPTY_LIST);
            return ResponseEntity.ok(tokenGenerator.createToken(authentication)); // Return generated token as response
        } catch (UsernameNotFoundException ex) {
            // Handle case where username is not found in the system
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Username not found!");
        } catch (BadCredentialsException ex) {
            // Handle case where credentials are bad (invalid username/password)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Bad credentials!");
        } catch (DataIntegrityViolationException ex) {
            // Handle case where there is a conflict, e.g., duplicate username
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Username may already exist!");
        } catch (Exception ex) {
            // Handle any other unexpected errors
            return ResponseEntity.internalServerError().body("Error: An unexpected error occurred. Please try again later.");
        }
    }

    // Endpoint for user login
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginDTO loginDTO) {
        try {
            logger.info("====== Login method called for username: " + loginDTO.getUsername()); // Log the username attempting login

            try {
                // Attempt to authenticate the user using the provided credentials
                Authentication authentication = daoAuthenticationProvider.authenticate(
                        UsernamePasswordAuthenticationToken.unauthenticated(loginDTO.getUsername(), loginDTO.getPassword())
                );
                // Generate and return a JWT token if authentication is successful
                return ResponseEntity.ok(tokenGenerator.createToken(authentication));
            } catch (Exception ex) {
                // Log error and return generic error message for any other exceptions
                logger.error(ex.getMessage());
                return ResponseEntity.internalServerError().body("Error: An unexpected error occurred. Please try again later.");
            }
        } catch (AuthenticationException ex) {
            // If authentication fails, throw BadCredentialsException with an appropriate message
            throw new BadCredentialsException("Invalid username or password", ex);
        } catch (Exception ex) {
            // Return a generic error response for any other exceptions
            return ResponseEntity.internalServerError().body("Error: An unexpected error occurred. Please try again later.");
        }
    }
}

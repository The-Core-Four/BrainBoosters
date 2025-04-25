package com.brainboosters.brainboosters.repositories;

import com.brainboosters.brainboosters.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    // Custom query to find a user by email
    User findByEmail(String email);
}

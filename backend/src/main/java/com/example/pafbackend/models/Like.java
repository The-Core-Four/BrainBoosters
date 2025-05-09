package com.example.pafbackend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a Like entity stored in MongoDB.
 * Maps to the "likes" collection in the database.
 * Tracks user likes on posts with relationships between:
 * - User (userId)
 * - Post (postId)
 */
@Document(collection = "likes")
public class Like {
    /**
     * MongoDB auto-generated primary key identifier
     * Uses MongoDB's ObjectId format
     */
    @Id
    private String id;
    
    /**
     * ID of the post being liked
     * References the Post collection
     */
    private String postId;

    // Getter and setter methods for postId
    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    // Getter and setter methods for userId
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    /**
     * ID of the user who created the like
     * References the User collection
     */
    private String userId;

    /**
     * No-argument constructor required by:
     * - MongoDB data mapping
     - Spring Data JPA
     */
    public Like() {}

    /**
     * All-arguments constructor for manual instance creation
     * @param id - MongoDB identifier (should typically be auto-generated)
     * @param postId - ID of the target post
     * @param userId - ID of the liking user
     */
    public Like(String id, String postId, String userId) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
    }

    // Getter and setter methods for MongoDB ID
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
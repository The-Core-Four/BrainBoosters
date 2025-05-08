import axios from "axios";
import { BASE_URL } from "../constants";
import NotificationService from "./NotificationService";

// Service class for handling comment-related operations
class CommentService {
  /**
   * Create a new comment and send notification
   * @param {Object} commentData - Comment data to be created
   * @param {string} username - Username of the comment author
   * @param {string} userId - ID of the user receiving the notification
   * @returns {Promise<Object>} Created comment data
   */
  async createComment(commentData, username, userId) {
    try {
      // Get access token from localStorage for authentication
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set authorization header
        },
      };

      // API call to create comment
      const response = await axios.post(
        `${BASE_URL}/comments`,
        commentData,
        config
      );

      // If comment creation is successful, create notification
      if (response.status === 200) {
        try {
          const body = {
            userId: userId,
            message: "You have a new comment",
            description: "Your post commented by " + username,
          };

          // Create notification (fire and forget)
          await NotificationService.createNotification(body);
        } catch (error) {
          // Empty catch to ensure comment creation isn't affected by notification failure
        }
      }
      return response.data;
    } catch (error) {
      throw new Error("Failed to create comment");
    }
  }

  /**
   * Get comments for a specific post
   * @param {string} postId - ID of the post to get comments for
   * @returns {Promise<Array>} List of comments
   */
  async getCommentsByPostId(postId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // API call to get comments by post ID
      const response = await axios.get(
        `${BASE_URL}/comments/post/${postId}`,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to get comments by post ID");
    }
  }

  /**
   * Update an existing comment
   * @param {string} commentId - ID of the comment to update
   * @param {Object} commentData - Updated comment data
   * @returns {Promise<Object>} Updated comment data
   */
  async updateComment(commentId, commentData) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // API call to update comment
      const response = await axios.put(
        `${BASE_URL}/comments/${commentId}`,
        commentData,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update comment");
    }
  }

  /**
   * Delete a comment
   * @param {string} commentId - ID of the comment to delete
   */
  async deleteComment(commentId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // API call to delete comment
      await axios.delete(`${BASE_URL}/comments/${commentId}`, config);
    } catch (error) {
      throw new Error("Failed to delete comment");
    }
  }
}

// Export singleton instance of the service
export default new CommentService();
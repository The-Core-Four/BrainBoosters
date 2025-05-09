import axios from "axios";
import { BASE_URL } from "../constants";
import NotificationService from "./NotificationService";

class LikeService {
  /**
   * Fetch likes for a specific post
   * @param {string} postId - ID of the post to get likes for
   * @returns {Promise<Array>} Array of like objects
   * @throws {Error} If request fails or authorization token is missing
   */
  async getLikesByPostId(postId) {
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");
      
      // Configure request headers with authorization token
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      
      // API call to get likes
      const response = await axios.get(`${BASE_URL}/likes/${postId}`, config);
      return response.data;
    } catch (error) {
      // Throw generic error message to caller
      throw new Error("Failed to get likes by post ID");
    }
  }

  /**
   * Create a new like and send notification to post owner
   * @param {Object} likeData - Like data payload
   * @param {string} username - Display name of the liking user
   * @param {string} userId - ID of the user receiving notification
   * @returns {Promise<Object>} Created like object
   * @throws {Error} If request fails or authorization token is missing
   */
  async createLike(likeData, username, userId) {
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");
      
      // Configure request headers with authorization token
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      
      // API call to create like
      const response = await axios.post(`${BASE_URL}/likes`, likeData, config);
      
      // Handle notification only if creation was successful (201 status)
      if (response.status === 201) {
        try {
          // Prepare notification payload
          const body = {
            userId: userId,
            message: "You have a new like",
            description: "Your post liked by " + username,
          };

          // Create notification silently (errors are caught but not handled)
          await NotificationService.createNotification(body);
        } catch (error) {
          // Notification failure is intentionally ignored
        }
      }
      return response.data;
    } catch (error) {
      // Throw generic error message to caller
      throw new Error("Failed to create like");
    }
  }

  /**
   * Delete an existing like
   * @param {string} likeId - ID of the like to delete
   * @throws {Error} If request fails or authorization token is missing
   */
  async deleteLike(likeId) {
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");
      
      // Configure request headers with authorization token
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      
      // API call to delete like
      await axios.delete(`${BASE_URL}/likes/${likeId}`, config);
    } catch (error) {
      // Throw generic error message to caller
      throw new Error("Failed to delete like");
    }
  }
}

export default new LikeService();
// LearningProgressService.js

import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

// Retrive LearningProgress
class LearningProgressService {
  async getAllLearningProgresss() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(`${BASE_URL}/LearningProgresss`, config);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch Learning Progresss");
    }
  }

  // Retrive LearningProgress
  async getLearningProgressById(id) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        `${BASE_URL}/LearningProgresss/${id}`,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch Learning Progress");
    }
  }

  // Create LearningProgress
  async CreateLearningProgressModal(LearningProgressData) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.post(
        `${BASE_URL}/LearningProgresss`,
        LearningProgressData,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create Learning Progress");
    }
  }

  // Update LearningProgress
  async updateLearningProgress(id, LearningProgressData) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.put(
        `${BASE_URL}/LearningProgresss/${id}`,
        LearningProgressData,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update Learning Progress");
    }
  }
// Delete LearningProgress
  async deleteLearningProgress(id) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(`${BASE_URL}/LearningProgresss/${id}`, config);
    } catch (error) {
      throw new Error("Failed to delete Learning Progress");
    }
  }
}

export default new LearningProgressService();

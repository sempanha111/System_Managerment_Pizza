import axios from 'axios';

const API_URL = "http://localhost:8000/api"; // Replace with your Laravel backend URL

// Login
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Store token in localStorage
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 422) {
        throw error.response.data.errors; // Validation errors
      } else if (error.response.status === 401) {
        throw new Error(error.response.data.message); // Invalid credentials
      }
    }
    throw new Error("Something went wrong."); // Network or unexpected errors
  }
};

// Logout
export const logout = async () => {
  try {
      const response = await axios.post(`${API_URL}/logout`, {}, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token
          },
      });

      if (response.data.success) {
          localStorage.removeItem('token'); // Clear token
      }

      return response.data.message;
  } catch (error) {
      console.error("Logout error:", error);
      throw new Error('Logout failed. Please try again.');
  }
};


// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

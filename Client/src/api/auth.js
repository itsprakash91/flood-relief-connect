// src/api/auth.js
import api from "./api";

/**
 * Register a new user
 * @param {Object} userData - { name, email, password, role }
 */
export const registerUser = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

/**
 * Login user and get access + refresh tokens
 * @param {Object} credentials - { email, password }
 */
export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  const { accessToken } = response.data;

  // Store access token locally
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  return response.data;
};

/**
 * Logout user (clears refresh token from backend)
 */
export const logoutUser = async () => {
  try {
    await api.post("/users/logout");
  } finally {
    localStorage.removeItem("accessToken");
  }
};

/**
 * Refresh access token (optional if handled in interceptor)
 */
export const refreshAccessToken = async () => {
  const response = await api.post("/users/refresh-token", {}, { withCredentials: true });
  const { accessToken } = response.data;
  localStorage.setItem("accessToken", accessToken);
  return accessToken;
};

/**
 * Get current logged-in user's profile
 */
export const getProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

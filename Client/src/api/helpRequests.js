// src/api/helpRequests.js
import api from "./api";

/**
 * Create a new help request
 * @param {Object} requestData - { title, description, location: { lat, lng }, category, urgency }
 */
export const createHelpRequest = async (requestData) => {
  const response = await api.post("/help-requests", requestData);
  return response.data;
};

/**
 * Get all help requests (for admin or global dashboard)
 */
export const getAllHelpRequests = async () => {
  const response = await api.get("/help-requests");
  return response.data?.helpRequests || [];
};

/**
 * Get nearby help requests by user's location
 * @param {Number} lat - latitude
 * @param {Number} lng - longitude
 * @param {Number} radius - search radius (in meters, default 5000)
 */
export const getNearbyRequests = async (lat, lng, radius = 5000) => {
  const response = await api.get(
    `/help-requests/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
  );
  return response.data?.helpRequests || [];
};

/**
 * Get a single help request by ID (for details page)
 * @param {String} id
 */
export const getHelpRequestById = async (id) => {
  const response = await api.get(`/help-requests/${id}`);
  return response.data?.helpRequest || response.data;
};

/**
 * Update help request status (for volunteers/admins)
 * @param {String} id - request ID
 * @param {String} status - e.g., 'pending', 'accepted', 'completed'
 * @param {String} assignedVolunteer - volunteer ID (required when accepting)
 */
export const updateHelpRequestStatus = async (id, status, assignedVolunteer = null) => {
  const response = await api.patch(`/help-requests/${id}/accept`, { 
    status,
    ...(assignedVolunteer && { assignedVolunteer })
  });
  return response.data;
};

/**
 * Assign a volunteer to a specific request (alias for updateHelpRequestStatus)
 * @param {String} requestId
 * @param {String} volunteerId
 */
export const assignVolunteer = async (requestId, volunteerId) => {
  return updateHelpRequestStatus(requestId, "accepted", volunteerId);
};

/**
 * Delete a help request (admin only)
 * @param {String} id
 */
export const deleteHelpRequest = async (id) => {
  const response = await api.delete(`/help-requests/${id}`);
  return response.data;
};

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Event APIs
export const eventAPI = {
  getAllEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  uploadBrochure: async (id, file) => {
    const formData = new FormData();
    formData.append('brochure', file);
    const response = await api.post(`/events/${id}/brochure`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadPhotos: async (id, files, metadata) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('photos', file));
    Object.keys(metadata).forEach((key) => {
      formData.append(key, JSON.stringify(metadata[key]));
    });
    const response = await api.post(`/events/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  addSchedule: async (id, scheduleItem) => {
    const response = await api.post(`/events/${id}/schedule`, scheduleItem);
    return response.data;
  },

  addFeedback: async (id, feedbackData) => {
    const response = await api.post(`/events/${id}/feedback`, feedbackData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

// IQAC APIs
export const iqacAPI = {
  getAllProposals: async () => {
    const response = await api.get('/iqac/proposals');
    return response.data;
  },

  getProposalById: async (id) => {
    const response = await api.get(`/iqac/proposals/${id}`);
    return response.data;
  },

  createProposal: async (proposalData) => {
    const response = await api.post('/iqac/proposals', proposalData);
    return response.data;
  },

  updateProposalStatus: async (id, statusData) => {
    const response = await api.put(`/iqac/proposals/${id}/status`, statusData);
    return response.data;
  },

  completeProposal: async (id, postEventData) => {
    const response = await api.post(`/iqac/proposals/${id}/complete`, postEventData);
    return response.data;
  },

  addPostEventDocumentation: async (eventId, documentation) => {
    const response = await api.put(`/iqac/events/${eventId}/documentation`, documentation);
    return response.data;
  },

  deleteProposal: async (id) => {
    const response = await api.delete(`/iqac/proposals/${id}`);
    return response.data;
  },
};

export default api;

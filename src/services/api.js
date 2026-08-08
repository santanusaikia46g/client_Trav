import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://server-trav.onrender.com/api';

const API = axios.create({
  baseURL: API_BASE_URL
});

// Request interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Packages APIs
export const getPackages = async (params = {}) => {
  const response = await API.get('/packages', { params });
  return response.data;
};

export const getPackage = async (id) => {
  const response = await API.get(`/packages/${id}`);
  return response.data;
};

export const createPackage = async (packageData) => {
  const response = await API.post('/packages', packageData);
  return response.data;
};

export const updatePackage = async (id, packageData) => {
  const response = await API.put(`/packages/${id}`, packageData);
  return response.data;
};

export const deletePackage = async (id) => {
  const response = await API.delete(`/packages/${id}`);
  return response.data;
};

// Destinations APIs
export const getDestinations = async () => {
  const response = await API.get('/destinations');
  return response.data;
};

export const createDestination = async (destData) => {
  const response = await API.post('/destinations', destData);
  return response.data;
};

export const updateDestination = async (id, destData) => {
  const response = await API.put(`/destinations/${id}`, destData);
  return response.data;
};

export const deleteDestination = async (id) => {
  const response = await API.delete(`/destinations/${id}`);
  return response.data;
};

// Inquiries APIs
export const submitInquiry = async (inquiryData) => {
  const response = await API.post('/inquiry', inquiryData);
  return response.data;
};

export const getInquiries = async () => {
  const response = await API.get('/inquiry');
  return response.data;
};

export const updateInquiryStatus = async (id, statusData) => {
  const payload = typeof statusData === 'object' ? statusData : { status: statusData };
  const response = await API.put(`/inquiry/${id}`, payload);
  return response.data;
};

export const deleteInquiry = async (id) => {
  const response = await API.delete(`/inquiry/${id}`);
  return response.data;
};

// Reviews APIs
export const getReviews = async (params = {}) => {
  const response = await API.get('/reviews', { params });
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await API.post('/reviews', reviewData);
  return response.data;
};

export const updateReview = async (id, reviewData) => {
  const response = await API.put(`/reviews/${id}`, reviewData);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await API.delete(`/reviews/${id}`);
  return response.data;
};

// Activity Logs API
export const getActivityLogs = async () => {
  const response = await API.get('/activity');
  return response.data;
};

// Admin Auth APIs
export const loginAdmin = async (username, password) => {
  const response = await API.post('/admin/login', { username, password });
  return response.data;
};

export const verifyAdmin = async () => {
  const response = await API.get('/admin/verify');
  return response.data;
};

export default {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  loginAdmin,
  verifyAdmin
};

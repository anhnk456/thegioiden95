import axios from 'axios';
import { getCurrentUser } from '@/api/auth';

// Create axios instance
const axiosInstance = axios.create();

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    // Add token to header if it exists
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    } else {
      config.headers.Authorization = null;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance; 
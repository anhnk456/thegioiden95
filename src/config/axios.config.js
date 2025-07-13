import axios from 'axios';
import { getCurrentUser } from '@/api/auth';
import { message } from 'ant-design-vue';

// Create axios instance
const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

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

// Add response interceptor with retry logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to network issues and we haven't retried yet
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return axiosInstance(originalRequest);
      } catch (retryError) {
        // If retry fails, show error message
        if (retryError.code === 'ECONNABORTED') {
          message.error('Kết nối đến máy chủ bị timeout. Vui lòng thử lại sau.');
        } else if (!retryError.response) {
          message.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
        }
        return Promise.reject(retryError);
      }
    }

    // Handle other errors
    if (error.code === 'ECONNABORTED') {
      message.error('Kết nối đến máy chủ bị timeout. Vui lòng thử lại sau.');
    } else if (!error.response) {
      message.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
    } else if (error.response.status === 401) {
      message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      // Optionally redirect to login page
      window.location.href = '/login';
    } else {
      message.error(error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 
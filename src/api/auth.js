import axiosInstance from '@/config/axios.config';
import { API_CONFIG } from '@/config/api.config';

const { AUTH_URL, API_URL } = API_CONFIG;

export const login = async (username, password) => {
  try {
    // Kiểm tra input trước khi gọi API
    if (!username || !password) {
      const error = new Error('Vui lòng điền đầy đủ thông tin đăng nhập');
      error.response = { status: 400 };
      throw error;
    }

    const response = await axiosInstance.post(`${AUTH_URL}/login`, {
      username,
      password
    });
    
    if (response.data) {
      // Kiểm tra dữ liệu response
      if (!response.data.roles || response.data.roles.length === 0) {
        console.warn('Warning: User data does not contain roles information');
      }
      
      // Lưu thông tin user vào localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    
    throw new Error('Invalid response data');
  } catch (error) {
    // Nếu là lỗi từ axios, trả về nguyên error để xử lý ở component
    if (error.response) {
      throw error;
    }
    
    // Nếu là lỗi khác, wrap lại với status code phù hợp
    const wrappedError = new Error(error.message);
    wrappedError.response = { status: 500 };
    throw wrappedError;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // Kiểm tra dữ liệu user có hợp lệ không
      if (!user || !user.roles) {
        localStorage.removeItem('user');
        return null;
      }
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    return null;
  }
};

export const register = async (userData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 
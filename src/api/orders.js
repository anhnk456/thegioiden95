import axiosInstance from '@/config/axios.config';
import { getCurrentUser } from './auth';
import { API_CONFIG } from '@/config/api.config';

const { API_URL } = API_CONFIG;

export const createOrder = async (orderData) => {
  const user = getCurrentUser();
  if (!user || !user.token) {
    throw new Error('Unauthorized');
  }

  return axiosInstance.post(`${API_URL}/orders`, {
    shippingAddress: orderData.shippingAddress,
    phoneNumber: orderData.phoneNumber,
    items: orderData.items.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }))
  });
};

export const getOrders = async () => {
  const user = getCurrentUser();
  if (!user || !user.token) {
    throw new Error('Unauthorized');
  }

  return axiosInstance.get(`${API_URL}/orders`);
};

export const updateOrderStatus = async (orderId, status) => {
  const user = getCurrentUser();
  if (!user || !user.token) {
    throw new Error('Unauthorized');
  }

  return axiosInstance.put(`${API_URL}/orders/${orderId}?status=${status}`);
}; 
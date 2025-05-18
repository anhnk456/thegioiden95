<template>
  <div class="orders-view">
    <HeaderVue />
    <div class="main-content">
      <div class="orders-container">
        <h2 class="page-title">Đơn hàng của tôi</h2>
        
        <a-spin :spinning="loading">
          <template v-if="orders.length > 0">
            <div class="orders-list">
              <a-card v-for="order in orders" :key="order.id" class="order-card">
                <template #title>
                  <div class="order-header">
                    <span class="order-id">Đơn hàng #{{ order.id }}</span>
                    <div class="status-container">
                      <a-tag :color="getStatusColor(order.status)">
                        {{ getStatusText(order.status) }}
                      </a-tag>
                      <template v-if="isAdmin">
                        <a-dropdown placement="bottomRight">
                          <a-button type="text" size="small">
                            <MoreOutlined />
                          </a-button>
                          <template #overlay>
                            <a-menu>
                              <a-sub-menu key="status" title="Thay đổi trạng thái">
                                <a-menu-item 
                                  v-for="status in orderStatuses" 
                                  :key="status.value"
                                  @click="handleStatusChange(order.id, status.value)"
                                  :disabled="order.status === status.value"
                                >
                                  <a-tag :color="getStatusColor(status.value)" style="min-width: 100px">
                                    {{ status.label }}
                                  </a-tag>
                                </a-menu-item>
                              </a-sub-menu>
                            </a-menu>
                          </template>
                        </a-dropdown>
                      </template>
                      <template v-else>
                        <a-dropdown placement="bottomRight" v-if="canCancelOrder(order.status)">
                          <a-button type="text" size="small">
                            <MoreOutlined />
                          </a-button>
                          <template #overlay>
                            <a-menu>
                              <a-menu-item 
                                key="cancel"
                                @click="handleStatusChange(order.id, 'CANCELLED')"
                              >
                                <a-tag color="red" style="min-width: 100px">
                                  Hủy đơn hàng
                                </a-tag>
                              </a-menu-item>
                            </a-menu>
                          </template>
                        </a-dropdown>
                      </template>
                    </div>
                  </div>
                </template>
                
                <div class="order-info">
                  <div class="info-row">
                    <span class="label">Ngày đặt:</span>
                    <span>{{ formatDate(order.orderDate) }}</span>
                  </div>
                  <div class="info-row" v-if="isAdmin">
                    <span class="label">Người đặt:</span>
                    <span class="username">{{ order.user.username }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Địa chỉ:</span>
                    <span>{{ order.shippingAddress }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Số điện thoại:</span>
                    <span>{{ order.phoneNumber }}</span>
                  </div>
                </div>

                <a-divider />

                <div class="order-items">
                  <div v-for="item in order.orderItems" :key="item.id" class="order-item">
                    <div class="item-image">
                      <img :src="item.product.linkAnhChinh" :alt="item.product.tenSanPham" />
                    </div>
                    <div class="item-details">
                      <div class="item-name">{{ item.product.tenSanPham }}</div>
                      <div class="item-price">{{ numberToVndCurrency(item.price) }} x {{ item.quantity }}</div>
                    </div>
                    <div class="item-total">
                      {{ numberToVndCurrency(item.subtotal) }}
                    </div>
                  </div>
                </div>

                <a-divider />

                <div class="order-total">
                  <span class="label">Tổng tiền:</span>
                  <span class="total-amount">{{ numberToVndCurrency(order.totalAmount) }}</span>
                </div>
              </a-card>
            </div>
          </template>
          <template v-else>
            <a-empty
              description="Bạn chưa có đơn hàng nào"
              class="empty-state"
            >
              <template #extra>
                <a-button type="primary" @click="$router.push('/')">
                  Mua sắm ngay
                </a-button>
              </template>
            </a-empty>
          </template>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { MoreOutlined } from '@ant-design/icons-vue';
import HeaderVue from "@/components/header.vue";
import { getOrders, updateOrderStatus } from '@/api/orders';
import { getCurrentUser } from '@/api/auth';
import { numberToVndCurrency } from '@/until/format';

// Đăng ký component MoreOutlined
const components = {
  MoreOutlined
};

const loading = ref(false);
const orders = ref([]);

const isAdmin = computed(() => {
  const user = getCurrentUser();
  return user?.roles?.includes('ROLE_ADMIN') || false;
});

const orderStatuses = [
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'SHIPPING', label: 'Đang giao hàng' },
  { value: 'DELIVERED', label: 'Đã giao hàng' },
  { value: 'CANCELLED', label: 'Đã hủy' }
];

const getStatusColor = (status) => {
  const statusColors = {
    PENDING: 'orange',
    CONFIRMED: 'blue',
    SHIPPING: 'purple',
    DELIVERED: 'green',
    CANCELLED: 'red'
  };
  return statusColors[status] || 'default';
};

const getStatusText = (status) => {
  return orderStatuses.find(s => s.value === status)?.label || status;
};

const canCancelOrder = (status) => {
  // Chỉ cho phép hủy đơn hàng khi trạng thái là PENDING hoặc CONFIRMED
  return ['PENDING', 'CONFIRMED'].includes(status);
};

const handleStatusChange = async (orderId, newStatus) => {
  try {
    loading.value = true;
    await updateOrderStatus(orderId, newStatus);
    message.success(newStatus === 'CANCELLED' ? 'Hủy đơn hàng thành công' : 'Cập nhật trạng thái đơn hàng thành công');
    await fetchOrders(); // Refresh orders list
  } catch (error) {
    console.error('Error updating order status:', error);
    message.error(newStatus === 'CANCELLED' ? 'Không thể hủy đơn hàng' : 'Không thể cập nhật trạng thái đơn hàng');
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${hours}:${minutes} ngày ${day} tháng ${month} năm ${year}`;
};

const fetchOrders = async () => {
  try {
    loading.value = true;
    const response = await getOrders();
    // Sắp xếp đơn hàng theo thời gian mới nhất
    orders.value = response.data.sort((a, b) => 
      new Date(b.orderDate) - new Date(a.orderDate)
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    if (error.message === 'Unauthorized' || error.response?.status === 401) {
      message.error('Vui lòng đăng nhập để xem đơn hàng');
    } else {
      message.error('Không thể tải danh sách đơn hàng');
    }
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);
</script>

<style scoped>
.orders-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  font-size: 24px;
  color: #1a365d;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 700;
  position: relative;
  padding-bottom: 12px;
  font-family: 'Times New Roman', Times, serif;
  letter-spacing: 0.5px;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: #00a859;
  border-radius: 2px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: none;
  margin-bottom: 16px;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.order-id {
  font-weight: 600;
  color: #1a365d;
  font-size: 14px;
}

.status-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-row {
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
  align-items: baseline;
  font-size: 13px;
}

.label {
  color: #666;
  min-width: 100px;
  font-weight: 500;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin: 8px 0;
}

.order-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 6px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #eee;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 500;
  margin-bottom: 4px;
  color: #2d3748;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  color: #666;
  font-size: 12px;
}

.item-total {
  font-weight: 600;
  color: #00a859;
  font-size: 13px;
}

.order-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #eee;
  margin-top: 12px;
}

.total-amount {
  font-size: 15px;
  font-weight: 600;
  color: #00a859;
}

.empty-state {
  padding: 48px 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

:deep(.ant-card-head) {
  min-height: auto;
  padding: 0 16px;
}

:deep(.ant-card-head-title) {
  padding: 12px 0;
}

:deep(.ant-card-body) {
  padding: 16px;
}

:deep(.ant-tag) {
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
}

:deep(.ant-btn) {
  border-radius: 6px;
}

:deep(.ant-dropdown-menu) {
  padding: 8px;
  border-radius: 8px;
}

:deep(.ant-dropdown-menu-item) {
  border-radius: 4px;
}

.username {
  font-weight: 500;
  color: #00a859;
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .info-row {
    flex-direction: column;
    gap: 2px;
  }

  .label {
    min-width: auto;
  }

  .order-item {
    flex-direction: row;
    text-align: left;
  }

  .item-total {
    margin-top: 0;
  }

  .order-total {
    flex-direction: row;
    align-items: center;
  }
}
</style> 
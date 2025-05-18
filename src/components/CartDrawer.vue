<template>
  <a-drawer
    :visible="cartStore.isCartOpen"
    @close="cartStore.toggleCart"
    title="Giỏ hàng"
    width="400"
    class="cart-drawer"
  >
    <template v-if="cartStore.totalItems > 0">
      <div class="cart-items">
        <div v-for="item in cartStore.cartItems" :key="item.id" class="cart-item">
          <div class="item-image">
            <img :src="item.linkAnhChinh" :alt="item.tenSanPham" />
          </div>
          <div class="item-details">
            <h4 class="item-name">{{ item.tenSanPham }}</h4>
            <div class="item-price">{{ numberToVndCurrency(item.giaSp) }}</div>
            <div class="item-controls">
              <a-input-number
                v-model:value="item.quantity"
                :min="1"
                @change="(value) => cartStore.updateQuantity(item.id, value)"
                size="small"
              />
              <a-button
                type="text"
                danger
                @click="cartStore.removeFromCart(item.id)"
              >
                <delete-outlined />
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add customer information form -->
      <div class="customer-form">
        <h3>Thông tin giao hàng</h3>
        <a-form layout="vertical">
          <a-form-item label="Số điện thoại" required>
            <a-input
              v-model:value="customerForm.phoneNumber"
              placeholder="Nhập số điện thoại"
            />
          </a-form-item>
          <a-form-item label="Địa chỉ nhận hàng" required>
            <a-textarea
              v-model:value="customerForm.address"
              placeholder="Nhập địa chỉ nhận hàng"
              :rows="2"
            />
          </a-form-item>
        </a-form>
      </div>

      <div class="cart-footer">
        <div class="cart-total">
          <span>Tổng tiền:</span>
          <span class="total-amount">{{ numberToVndCurrency(cartStore.totalAmount) }}</span>
        </div>
        <div class="cart-actions">
          <a-button @click="cartStore.clearCart" danger>Xóa giỏ hàng</a-button>
          <a-button 
            type="primary" 
            @click="placeOrder"
            :loading="isSubmitting"
          >
            Đặt hàng
          </a-button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="empty-cart">
        <shopping-outlined />
        <p>Giỏ hàng trống</p>
        <a-button type="primary" @click="cartStore.toggleCart">
          Tiếp tục mua sắm
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>

<script setup>
import { useCartStore } from '@/store/cart';
import { numberToVndCurrency } from '@/until/format';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { createOrder } from '@/api/orders';
import { getCurrentUser } from "@/api/auth";
import { useRouter } from 'vue-router';

const router = useRouter();
const cartStore = useCartStore();
const customerForm = ref({
  phoneNumber: '',
  address: '',
});
const isSubmitting = ref(false);

const placeOrder = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    message.error('Vui lòng đăng nhập để đặt hàng');
    return;
  }

  if (!customerForm.value.phoneNumber || !customerForm.value.address) {
    message.error('Vui lòng điền đầy đủ thông tin giao hàng');
    return;
  }

  try {
    isSubmitting.value = true;
    
    const orderData = {
      shippingAddress: customerForm.value.address,
      phoneNumber: customerForm.value.phoneNumber,
      items: cartStore.cartItems
    };
    
    const response = await createOrder(orderData);
    
    // Kiểm tra response status
    if (response && response.status === 200) {
      message.success('Đặt hàng thành công');
      cartStore.clearCart();
      cartStore.toggleCart();
      
      // Reset form
      customerForm.value = {
        phoneNumber: '',
        address: ''
      };

      // Kiểm tra nếu đang ở trang orders thì reload lại danh sách
      if (router.currentRoute.value.name === 'orders') {
        window.location.reload();
      }
    } else {
      throw new Error('Đặt hàng không thành công');
    }
  } catch (error) {
    console.error('Order error:', error);
    if (error.message === 'Unauthorized' || error.response?.status === 401) {
      message.error('Vui lòng đăng nhập lại để đặt hàng');
    } else {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng, vui lòng thử lại');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.cart-drawer {
  :deep(.ant-drawer-body) {
    padding: 0;
    display: flex;
    flex-direction: column;
  }
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.cart-item {
  display: flex;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  gap: 16px;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f8f9fa;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  margin: 0 0 8px;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #2c3e50;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-price {
  color: #00a859;
  font-weight: 600;
  margin-bottom: 8px;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cart-footer {
  border-top: 1px solid #f0f0f0;
  padding: 16px;
  background: white;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 1.1rem;
}

.total-amount {
  color: #00a859;
  font-weight: 600;
}

.cart-actions {
  display: flex;
  gap: 12px;
}

.cart-actions .ant-btn {
  flex: 1;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  text-align: center;
}

.empty-cart .anticon {
  font-size: 48px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-cart p {
  color: #8c8c8c;
  margin-bottom: 24px;
}

.customer-form {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.customer-form h3 {
  margin: 0 0 16px;
  font-size: 1rem;
  color: #2c3e50;
}

:deep(.ant-form-item) {
  margin-bottom: 12px;
}

:deep(.ant-form-item-label) {
  padding-bottom: 4px;
}

:deep(.ant-input),
:deep(.ant-input-textarea) {
  border-radius: 4px;
}
</style> 
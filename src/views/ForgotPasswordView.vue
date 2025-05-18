<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <h2 class="forgot-password-title">Quên mật khẩu</h2>
      
      <a-form
        :model="formState"
        name="forgot-password"
        @finish="handleSubmit"
        autocomplete="off"
        class="forgot-password-form"
      >
        <p class="description">
          Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
        </p>

        <a-form-item
          name="email"
          :rules="[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]"
        >
          <a-input 
            v-model:value="formState.email"
            placeholder="Email"
            size="large"
          >
            <template #prefix>
              <mail-outlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            class="submit-button"
            size="large"
          >
            Gửi yêu cầu
          </a-button>
        </a-form-item>

        <div class="login-section">
          <a-button type="link" @click="handleBackToLogin">
            ← Quay lại đăng nhập
          </a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { MailOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);

const formState = reactive({
  email: ''
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    // TODO: Implement forgot password API call
    message.success('Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.');
    router.push('/login');
  } catch (error) {
    console.error('Forgot password error:', error);
    message.error('Có lỗi xảy ra. Vui lòng thử lại!');
  } finally {
    loading.value = false;
  }
};

const handleBackToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/img/login-bg.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

.forgot-password-container::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.forgot-password-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.forgot-password-title {
  text-align: center;
  color: #1a365d;
  font-size: 28px;
  margin-bottom: 16px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 1.5;
}

.submit-button {
  width: 100%;
  background: #2b4c8c;
  border-color: #2b4c8c;
  height: 45px;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background: #1a365d;
  border-color: #1a365d;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.login-section {
  text-align: center;
  margin-top: 16px;
}

.login-section .ant-btn-link {
  color: #2b4c8c;
  font-weight: 500;
}

.login-section .ant-btn-link:hover {
  color: #1a365d;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 10px;
  height: 45px;
  border: 1px solid rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

:deep(.ant-input-affix-wrapper:hover) {
  border-color: #2b4c8c;
  box-shadow: 0 0 0 2px rgba(43,76,140,0.1);
}

:deep(.ant-input-affix-wrapper-focused) {
  border-color: #2b4c8c;
  box-shadow: 0 0 0 2px rgba(43,76,140,0.2);
}

:deep(.ant-form-item) {
  margin-bottom: 24px;
}

:deep(.ant-form-item:last-child) {
  margin-bottom: 0;
}
</style> 
<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Đăng nhập</h2>
      
      <a-form
        :model="formState"
        name="login"
        @finish="handleSubmit"
        autocomplete="off"
        class="login-form"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]"
        >
          <a-input 
            v-model:value="formState.username"
            placeholder="Tên đăng nhập"
            size="large"
          >
            <template #prefix>
              <user-outlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="Mật khẩu"
            size="large"
          >
            <template #prefix>
              <lock-outlined />
            </template>
          </a-input-password>
        </a-form-item>

        <div class="form-footer">
          <a-form-item>
            <a-checkbox v-model:checked="formState.remember">
              Ghi nhớ đăng nhập
            </a-checkbox>
          </a-form-item>
          
          <a-button type="link" class="forgot-password" @click="handleForgotPassword">
            Quên mật khẩu?
          </a-button>
        </div>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            class="login-button"
            size="large"
          >
            Đăng nhập
          </a-button>
        </a-form-item>

        <div class="register-section">
          <span>Chưa có tài khoản? </span>
          <a-button type="link" @click="handleRegister">Đăng ký ngay</a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/auth';

const router = useRouter();
const loading = ref(false);

const formState = reactive({
  username: '',
  password: '',
  remember: true
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    const response = await login(formState.username, formState.password);
    
    // Kiểm tra role từ response
    const userRole = response.roles?.[0];
    if (userRole === 'ROLE_ADMIN') {
      message.success('Đăng nhập thành công');
      router.push('/admin');
    } else if (userRole === 'ROLE_USER') {
      message.success('Đăng nhập thành công');
      router.push('/');
    } else {
      message.error('Bạn không có quyền truy cập!');
      // Xóa thông tin đăng nhập không hợp lệ
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Login error:', error);
    
    // Kiểm tra loại lỗi từ response
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('Tên đăng nhập hoặc mật khẩu không chính xác!');
          break;
        case 403:
          message.error('Tài khoản của bạn đã bị khóa!');
          break;
        case 404:
          message.error('Tài khoản không tồn tại!');
          break;
        case 400:
          message.error('Vui lòng điền đầy đủ thông tin đăng nhập!');
          break;
        default:
          message.error('Đăng nhập thất bại. Vui lòng thử lại sau!');
      }
    } else if (error.request) {
      message.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối!');
    } else {
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  } finally {
    loading.value = false;
  }
};

const handleRegister = () => {
  router.push('/register');
};

const handleForgotPassword = () => {
  router.push('/forgot-password');
};
</script>

<style scoped>
.login-container {
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

.login-container::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5); /* Overlay tối màu để text dễ đọc hơn */
  pointer-events: none;
}

.login-card {
  position: relative;
  z-index: 1; /* Đảm bảo card nằm trên overlay */
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  transform: perspective(1000px) rotateY(0deg);
  transition: transform 0.5s ease;
}

.login-card:hover {
  transform: perspective(1000px) rotateY(2deg) translateY(-5px);
}

.login-title {
  text-align: center;
  color: #1a365d;
  font-size: 28px;
  margin-bottom: 32px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.login-form {
  width: 100%;
}

.login-button {
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

.login-button:hover {
  background: #1a365d;
  border-color: #1a365d;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
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

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #2b4c8c;
  border-color: #2b4c8c;
}

:deep(.ant-form-item-explain-error) {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

:deep(.anticon) {
  color: #2b4c8c;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  padding: 0;
  height: auto;
  color: #2b4c8c;
}

.forgot-password:hover {
  color: #1a365d;
}

.register-section {
  text-align: center;
  margin-top: 16px;
  color: #666;
}

.register-section .ant-btn-link {
  padding: 0 4px;
  height: auto;
  color: #2b4c8c;
  font-weight: 500;
}

.register-section .ant-btn-link:hover {
  color: #1a365d;
}

:deep(.ant-form-item) {
  margin-bottom: 24px;
}

:deep(.ant-form-item:last-child) {
  margin-bottom: 0;
}
</style> 
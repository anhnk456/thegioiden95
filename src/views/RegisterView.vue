<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">Đăng ký tài khoản</h2>
      <a-form
        :model="formState"
        name="register"
        @finish="onFinish"
        :rules="rules"
        autocomplete="off"
        class="register-form"
      >
        <a-form-item name="username">
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

        <a-form-item name="email">
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

        <a-form-item name="password">
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

        <a-form-item name="confirmPassword">
          <a-input-password
            v-model:value="formState.confirmPassword"
            placeholder="Xác nhận mật khẩu"
            size="large"
          >
            <template #prefix>
              <lock-outlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            class="register-button"
            size="large"
          >
            Đăng ký
          </a-button>
        </a-form-item>

        <div class="login-section">
          <span>Đã có tài khoản? </span>
          <a-button type="link" @click="handleLogin">Đăng nhập</a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { register } from '@/api/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);

const formState = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const validateEmail = async (rule, value) => {
  if (!value) {
    return Promise.reject('Vui lòng nhập email');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return Promise.reject('Email không hợp lệ');
  }
  return Promise.resolve();
};

const validateConfirmPassword = async (rule, value) => {
  if (value !== formState.password) {
    return Promise.reject('Mật khẩu xác nhận không khớp');
  }
  return Promise.resolve();
};

const rules = {
  username: [
    { required: true, message: 'Vui lòng nhập tên đăng nhập', trigger: 'blur' },
    { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự', trigger: 'blur' }
  ],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Vui lòng xác nhận mật khẩu', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
};

const onFinish = async (values) => {
  try {
    loading.value = true;
    const { confirmPassword, ...registerData } = values;
    await register(registerData);
    message.success('Đăng ký thành công');
    router.push('/login');
  } catch (error) {
    message.error(error.message || 'Đăng ký thất bại');
  } finally {
    loading.value = false;
  }
};

const handleLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
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

.register-container::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.register-card {
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

.register-title {
  text-align: center;
  color: #1a365d;
  font-size: 28px;
  margin-bottom: 32px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.register-button {
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

.register-button:hover {
  background: #1a365d;
  border-color: #1a365d;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.login-section {
  text-align: center;
  margin-top: 16px;
  color: #666;
}

.login-section .ant-btn-link {
  padding: 0 4px;
  height: auto;
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
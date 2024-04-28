<template>
  <div>
    <HeaderVue />
    <a-space v-if="isAdmin" class="mt-4" style="margin-left: 2rem" wrap>
      <a-button @click="onAddCategory">Quản lý danh mục</a-button>
      <a-button @click="onAddImg">Quản lý sản phẩm</a-button>
    </a-space>
    <div v-else class="login-container">
      <h2>Đăng nhập</h2>
      <a-form
        :label-col="{ span: 8 }"
        style="margin-top: 2rem"
        :model="loginForm"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Vui lòng nhập username' }]"
        >
          <a-input v-model:value="loginForm.username" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Vui lòng nhập password!' }]"
        >
          <a-input-password v-model:value="loginForm.password" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="submitLogin">Xác nhận</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";

import HeaderVue from "@/components/header.vue";

const router = useRouter();

const loginForm = ref({
  username: "",
  password: "",
});

const isAdmin = ref(false);

const onAddCategory = () => {
  router.push("/add-category");
};

const onAddImg = () => {
  router.push("/add-img");
};

const submitLogin = () => {
  const { username, password } = loginForm.value;

  if (username !== "root" && password !== "Abc@12345") {
    message.error("Sai tài khoản hoặc mật khẩu");
  }
  message.success("Đăng nhập thành công");
  isAdmin.value = true;
  localStorage.setItem("login", "true");
};

onMounted(() => {
  const login = localStorage.getItem("login");
  if (!!login && login === "true") {
    isAdmin.value = true;
  }
});
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>

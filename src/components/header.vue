<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getCurrentUser, logout } from "@/api/auth";
import axios from 'axios';

import {
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons-vue";
import { getAllDanhMuc } from "@/api/den-led.js";
import {
  getDataCategoryParent,
  fetchCategoryParent,
} from "@/store/categoryParent";
import { useCartStore } from '@/store/cart';

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();
const currentUser = ref(getCurrentUser());

const loading = ref(false);
const open = ref(false);
const categoryList = ref([]);
const categoryHeader = ref([]);
const categoryListParent = ref([]);
const categoryListParentHeader = ref([]);
const valueSearch = ref();
const categoryMenu = ref([]);

// Kiểm tra xem có phải đang ở trang admin hoặc trang orders không
const isAdminPage = computed(() => {
  return route.path === '/admin' || route.path === '/orders';
});

const showDrawer = () => {
  open.value = true;
};

const handleSearch = () => {
  router.push({ path: "/search", query: { value: valueSearch.value } });
};

const goSearchSpByDm = (id, name) => {
  open.value = false;
  router.push({ path: "/search", query: { id, name } });
};

const handleLogout = () => {
  logout();
  currentUser.value = null;
  router.push('/login');
};

const getCategoryList = () => {
  return JSON.parse(JSON.stringify(categoryList.value));
};

const goSearchByDanhMuc = (id) => {
  router.push({ path: '/search', query: { id } });
};

onMounted(async () => {
  // Chỉ gọi API khi không phải ở trang admin
  if (!isAdminPage.value) {
    try {
      loading.value = true;
      const res = await getAllDanhMuc();
      await fetchCategoryParent();

      categoryList.value = res.data;
      categoryListParent.value = getDataCategoryParent();
      categoryListParentHeader.value = categoryListParent.value.slice(0, 5);

      // Lấy menu danh mục cho thanh icon
      const resMenu = await axios.get('http://47.129.50.217:8080/get-all-danh-muc-by-thu-muc');
      categoryMenu.value = resMenu.data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }
});

defineExpose({ getCategoryList });
</script>

<template>
  <a-spin :spinning="loading">
    <div class="header-top">
      <a-row>
        <a-col :span="24">
          <div v-if="!isAdminPage" style="margin-left: 2rem; font-weight: 600">
            <!-- Removed company name -->
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="nav">
      <div class="nav-pc nav-flex-row">
        <a href="/" class="navigation-logo" style="margin-right: 12px;">
          <img
            class="navigation-logo-img"
            src="../assets/img/logo.png"
            alt="Đèn LED VN"
          />
        </a>
        <div v-if="!isAdminPage" class="nav-category nav-flex-row mobile-category-bar" style="margin-left: 0;">
          <ul class="category-pc nav-flex-row">
            <!-- Mục tất cả SP -->
            <li class="category-pc-item category-pc-show-all" style="padding: 0 8px;">
              <a-popover placement="bottomRight">
                <template #content>
                  <a-row style="width: 800px" :gutter="20">
                    <a-col
                      v-for="item in categoryListParent"
                      :key="item.id"
                      span="6"
                    >
                      <div style="font-weight: bold; margin-bottom: 0.5rem">
                        {{ item.tenThuMuc }}
                      </div>
                      <li
                        v-for="catagory in item.listDanhMuc"
                        :key="catagory.id"
                        @click="goSearchSpByDm(catagory.id, catagory.tenDanhMuc)"
                      >
                        <div class="caterogy-list-item-all">
                          {{ catagory.tenDanhMuc }}
                        </div>
                      </li>
                    </a-col>
                  </a-row>
                </template>
                <a class="category-pc-list category-pc-icon">
                  <span style="display:block;width:32px;height:32px;margin:0 auto;">
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      <rect y="6" width="32" height="4" rx="2" fill="#888"/>
                      <rect y="14" width="32" height="4" rx="2" fill="#888"/>
                      <rect y="22" width="32" height="4" rx="2" fill="#888"/>
                    </svg>
                  </span>
                  <span style="display:block;font-size:13px;margin-top:2px;text-align:center;">Tất cả</span>
                </a>
              </a-popover>
            </li>
            <!-- Các mục còn lại -->
            <li v-for="item in categoryMenu" :key="item.id" class="category-pc-item mobile-hide-category" style="padding: 0 8px;">
              <a class="category-pc-list category-pc-icon" @click="goSearchByDanhMuc(item.listDanhMuc[0]?.id)">
                <img v-if="item.listDanhMuc[0]?.anhDanhMuc" :src="item.listDanhMuc[0].anhDanhMuc" alt="icon" style="width:32px;height:32px;border-radius:50%;background:#eee;object-fit:cover;display:block;margin:0 auto;" />
                <span style="display:block;font-size:13px;margin-top:2px;text-align:center;">{{ item.listDanhMuc[0]?.tenDanhMuc }}</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="nav-actions nav-flex-row" style="margin-left:auto;align-items:center;">
          <div class="nav-search">
            <a-input-group compact class="search-group">
              <a-input
                v-model:value="valueSearch"
                size="large"
                style="width: 60%"
                placeholder="Tìm kiếm sản phẩm..."
              />
              <a-button @click="handleSearch" size="large">
                <template #icon><SearchOutlined /></template>
              </a-button>
            </a-input-group>
          </div>
          <div class="user-actions nav-flex-row" style="align-items:center;">
            <a-button @click="cartStore.toggleCart" size="large" type="text" class="cart-button">
              <template #icon>
                <shopping-cart-outlined />
              </template>
              <a-badge
                :count="cartStore.totalItems"
                :offset="[-8, -8]"
                :number-style="{
                  backgroundColor: '#00a859',
                }"
              />
            </a-button>
            <a-dropdown v-if="currentUser" placement="bottomRight">
              <a-button size="large" type="text" class="user-button">
                <template #icon><UserOutlined /></template>
              </a-button>
              <template #overlay>
                <a-menu class="user-menu">
                  <div class="user-info">
                    <h4>{{ currentUser.username }}</h4>
                    <p>{{ currentUser.roles?.includes('ROLE_ADMIN') ? 'Quản trị viên' : 'Người dùng' }}</p>
                  </div>
                  <a-menu-divider />
                  <a-menu-item v-if="currentUser.roles?.includes('ROLE_ADMIN')" @click="router.push('/admin')">
                    <SettingOutlined />
                    <span>Quản lý hệ thống</span>
                  </a-menu-item>
                  <a-menu-item v-else @click="router.push('/profile')">
                    <UserOutlined />
                    <span>Thông tin tài khoản</span>
                  </a-menu-item>
                  <a-menu-item @click="router.push('/orders')">
                    <shopping-outlined />
                    <span>Đơn hàng của tôi</span>
                  </a-menu-item>
                  <a-menu-item @click="handleLogout">
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-button v-else @click="router.push('/login')" size="large" type="text">
              <template #icon><UserOutlined /></template>
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<style scoped>
.nav {
  position: -webkit-sticky;
  position: sticky;
  top: -1px;
  z-index: 999;
}

.nav-pc {
  display: flex;
  align-items: center !important;
  height: 72px;
  min-height: 72px;
  padding: 0 12px;
  gap: 0;
}

.navigation-logo-img {
  width: 217px;
  height: 70px;
  object-fit: fill;
  max-height: 100%;
  text-decoration: none;
}

.category-pc {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 0;
}

.category-pc-item {
  padding: 5px 5px;
  position: relative;
}

.category-pc-item:hover {
  animation: growth linear 0.3s;
}

.caterogy-list-item-all {
  font-size: small;
  margin-left: 1rem;
}

.caterogy-list-item-all:hover {
  cursor: pointer;
  color: var(--green-color);
}

.category-pc-list {
  text-decoration: none;
  font-size: 1.3rem;
  color: var(--black-color);
  border-radius: 20px;
  padding: 5px;
  transition: 0.5s linear;
}

.category-pc-list:hover {
  color: var(--green-color);
  /* background-color: var(--green-color); */
}
.category-pc-list::before {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 36px;
  left: 0;
  top: 17px;
}

.category-all-menu {
  position: absolute;
  list-style: none;
  box-shadow: 0 0 2px rgb(0, 0, 0, 5);
  background-color: var(--white-color);
  top: 54px;
  z-index: 1;
  display: none;
  animation: fadeIn linear 0.5s;
}

.category-pc-show-all:hover .category-all-menu {
  display: block;
  animation: exampCategory linear 0.5s;
}

.category-all-menu-item {
  display: block;
  padding: 2px 0;
  width: 250px;
  max-width: 100%;
  border-bottom: 1px solid #ccc;
  transition: 0.5s;
}

.category-all-menu-item:hover {
  background-color: var(--green-color);
}

.category-all-menu-list {
  padding: 10px 15px;
  font-size: 1.3rem;
  text-decoration: none;
  color: var(--black-color);
  text-transform: uppercase;
  display: block;
  position: relative;
  transition: right linear 0.4s;
  right: 0;
}

.category-all-menu-list:hover {
  right: -6px;
  color: var(--white-color);
}

.nav-actions {
  display: flex;
  align-items: center;
  margin-left: auto !important;
  gap: 8px;
  height: 72px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-group {
  min-width: 400px;
}

.search-group :deep(.ant-input) {
  font-size: 14px;
}

.search-group :deep(.ant-select-selector) {
  height: 40px !important;
  padding: 4px 11px !important;
}

.search-group :deep(.ant-select-selection-item) {
  line-height: 30px !important;
}

.search-group :deep(.ant-btn) {
  height: 40px;
  width: 40px;
}

.search-group :deep(.anticon) {
  font-size: 18px;
}

.cart-button,
.user-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  margin: 0 4px;
}

.cart-button :deep(.anticon),
.user-button :deep(.anticon) {
  font-size: 20px;
}

.user-menu {
  font-size: 12px;
}

.user-info {
  padding: 12px 16px;
}

.user-info h4 {
  font-size: 14px;
  margin: 0;
}

.user-info p {
  font-size: 12px;
  margin: 4px 0 0;
  color: #666;
}

.nav-search-btn {
  width: 220px;
  height: 40px;
  font-size: 1.3rem;
  outline: none;
  padding: 0 10px;
  border-radius: 50px;
  background-color: #f3f3f3;
  border-color: transparent;
}

.nav-search-btn-icon {
  position: absolute;
  right: 12px;
  top: 11px;
  color: var(--text-color);
  font-size: 1.6rem;
  transition: 0.3s;
}

.nav-search-btn-icon:hover {
  color: var(--primary-color);
  cursor: pointer;
  top: 7px;
}

.nav-cart {
  position: relative;
}

.nav-cart-icon:hover {
  background-color: var(--primary-color);
  cursor: pointer;
}

.nav-cart-icon {
  font-size: 1.8rem;
  padding: 10px;
  color: var(--white-color);
  background: var(--black-color);
  border-radius: 30px;
  transition: 0.3s linear;
}

.nav-bars-btn {
  display: none;
}

.nav-mobile {
  width: 100%;
}
.nav-mobile-content {
  font-size: 1.4rem;
  padding: 10px 10px;
  color: var(--black-color);
  font-weight: 800;
  display: block;
  border-bottom: 1px solid #ccc;
}

.header-top-more-info {
  display: block;
}
/*  Mobile & Tablet */
@media (max-width: 63.9375em) {
  .mobile-hide-category {
    display: none !important;
  }
  .mobile-category-bar {
    min-width: unset !important;
    margin-right: 0 !important;
  }
  .nav-category {
    margin-right: 0 !important;
  }
  .nav-pc {
    padding: 0 4px !important;
  }
  .navigation-logo-img {
    width: 120px !important;
    height: 40px !important;
  }
  .nav-actions {
    flex-direction: row !important;
    gap: 8px !important;
    display: flex !important;
    align-items: center !important;
    margin-left: auto !important;
    height: 48px !important;
  }
  .user-actions {
    flex-direction: row !important;
    gap: 8px !important;
    display: flex !important;
    align-items: center !important;
  }
  .nav-search {
    margin: 0 4px !important;
    height: 48px !important;
  }
  .search-group {
    min-width: 120px !important;
    width: 120px !important;
    display: flex !important;
    align-items: center !important;
  }
  .search-group :deep(.ant-input) {
    width: 70px !important;
    height: 32px !important;
    font-size: 13px !important;
    border-radius: 4px 0 0 4px !important;
  }
  .search-group :deep(.ant-btn) {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    border-radius: 0 4px 4px 0 !important;
    padding: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .category-pc-item.category-pc-show-all {
    padding: 0 4px !important;
  }
  .category-pc-list.category-pc-icon span {
    font-size: 12px !important;
  }
}

/* Tablet pro: min-width >= 740px and max-width < 1023px */
@media only screen and (min-width: 64em) and (max-width: 85.375em) {
  .nav-category {
    display: none;
  }

  .nav-bars-btn {
    display: block;
  }

  /* .header-top-more-info {
    display: none;
  } */
}

/* Tablet: min-width >= 740px and max-width < 1023px */
@media only screen and (min-width: 46.25em) and (max-width: 63.9375em) {
  .nav-pc {
    justify-content: space-around;
  }

  .nav-bars-btn {
    display: block;
  }

  .nav-search-btn {
    width: 300px;
    max-width: 100%;
    height: 60px;
    font-size: 1.6rem;
  }

  .nav-search-btn-icon {
    font-size: 2rem;
    top: 15px;
  }

  .nav-cart {
    margin-left: 0;
  }

  .nav-cart-icon {
    font-size: 2rem;
  }

  .header-top-more-info {
    display: none;
  }
}

/* Mobile: max-width < 739px */
@media only screen and (max-width: 46.1875em) {
  .nav-cart {
    margin-left: 0;
  }
}

.cart-button {
  margin-right: 12px;
  position: relative;
}

.cart-button :deep(.anticon) {
  font-size: 16px;
}

.cart-button:hover {
  color: #00a859;
}

.user-button {
  color: inherit;
}

.user-button:hover {
  color: #00a859;
}

.user-button :deep(.anticon) {
  font-size: 16px;
}

:deep(.user-menu) {
  min-width: 200px;
}

:deep(.ant-dropdown-menu-item) {
  padding: 12px 16px;
}

:deep(.ant-dropdown-menu-item .anticon) {
  margin-right: 8px;
  font-size: 16px;
}

:deep(.ant-dropdown-menu-item:hover) {
  background-color: #f0f7ff;
}

:deep(.ant-dropdown-menu-item:hover .anticon) {
  color: #00a859;
}

@media (max-width: 768px) {
  .nav-actions {
    flex-direction: column;
    gap: 12px;
  }

  .search-group {
    min-width: 300px;
  }
}

.nav-pc.nav-flex-row {
  display: flex;
  align-items: flex-end;
  gap: 0;
}
.nav-category.nav-flex-row {
  display: flex;
  align-items: flex-end;
  margin-left: 0;
}
.category-pc.nav-flex-row {
  display: flex;
  align-items: flex-end;
  gap: 0;
  margin: 0;
}
.category-pc-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
}
.category-pc-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0;
  margin: 0;
}
.nav-actions.nav-flex-row {
  display: flex;
  align-items: flex-end;
  margin-left: auto;
  gap: 12px;
  margin-bottom: 2px;
}
.user-actions.nav-flex-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* --- Ghi đè căn chỉnh header sát hàng, đồng nhất chiều cao, căn giữa dọc, các thành phần sát nhau --- */
.nav-pc {
  display: flex;
  align-items: center !important;
  height: 72px;
  min-height: 72px;
  padding: 0 12px;
  gap: 0;
}

.navigation-logo {
  display: flex;
  align-items: center;
  height: 72px;
  margin-right: 8px !important;
}

.nav-category {
  display: flex;
  align-items: center;
  margin-left: 0 !important;
  margin-right: 8px !important;
}

.category-pc {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 0;
}

.category-pc-item,
.category-pc-icon {
  margin: 0 !important;
  padding: 0 4px !important;
  height: 72px;
  justify-content: center;
}

.category-pc-icon img,
.category-pc-icon svg {
  width: 32px;
  height: 32px;
  margin: 0 auto;
  display: block;
}

.category-pc-icon span {
  margin-top: 2px;
  font-size: 13px;
  line-height: 1.2;
  text-align: center;
  display: block;
}

.nav-search {
  display: flex;
  align-items: center;
  height: 72px;
  margin: 0 8px;
}

.search-group :deep(.ant-input),
.search-group :deep(.ant-btn) {
  height: 40px !important;
  line-height: 40px !important;
}

.cart-button,
.user-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  margin: 0 4px;
}
</style>

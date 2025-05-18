<template>
  <div class="admin-layout">
    <HeaderVue />
    
    <div class="admin-container">
      <div class="admin-header">
        <h2 class="admin-title">Quản lý hệ thống</h2>
        <p class="admin-subtitle">Chào mừng bạn đến với trang quản trị</p>
      </div>

      <div class="admin-content">
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-card hoverable class="admin-card" @click="onAddCategoryParent">
              <template #cover>
                <div class="card-icon">
                  <folder-outlined />
                </div>
              </template>
              <a-card-meta title="Quản lý danh mục cha" description="Thêm, sửa, xóa danh mục cha" />
            </a-card>
          </a-col>

          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-card hoverable class="admin-card" @click="onAddCategory">
              <template #cover>
                <div class="card-icon">
                  <appstore-outlined />
                </div>
              </template>
              <a-card-meta title="Quản lý danh mục" description="Thêm, sửa, xóa danh mục sản phẩm" />
            </a-card>
          </a-col>

          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-card hoverable class="admin-card" @click="onAddImg">
              <template #cover>
                <div class="card-icon">
                  <shopping-outlined />
                </div>
              </template>
              <a-card-meta title="Quản lý sản phẩm" description="Thêm, sửa, xóa sản phẩm" />
            </a-card>
          </a-col>

          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-card hoverable class="admin-card" @click="onAddBanner">
              <template #cover>
                <div class="card-icon">
                  <picture-outlined />
                </div>
              </template>
              <a-card-meta title="Quản lý Banner" description="Cập nhật banner trang chủ" />
            </a-card>
          </a-col>

          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-card hoverable class="admin-card" @click="onAddPriority">
              <template #cover>
                <div class="card-icon">
                  <ordered-list-outlined />
                </div>
              </template>
              <a-card-meta title="Mức độ ưu tiên" description="Thiết lập độ ưu tiên hiển thị" />
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import HeaderVue from "@/components/header.vue";
import {
  FolderOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  PictureOutlined,
  OrderedListOutlined
} from '@ant-design/icons-vue';

const router = useRouter();

const onAddCategory = () => {
  router.push("/add-category");
};

const onAddImg = () => {
  router.push("/add-img");
};

const onAddBanner = () => {
  router.push("/add-banner");
};

const onAddCategoryParent = () => {
  router.push("/add-category-parent");
};

const onAddPriority = () => {
  router.push("/add-priority");
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.admin-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  margin-bottom: 32px;
  text-align: center;
}

.admin-title {
  color: #1a365d;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.admin-subtitle {
  color: #666;
  margin-top: 8px;
}

.admin-content {
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.admin-card {
  transition: all 0.3s ease;
}

.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.card-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  background: linear-gradient(135deg, #2b4c8c 0%, #1a365d 100%);
  color: white;
}

:deep(.anticon) {
  font-size: 48px;
}

:deep(.ant-card-meta-title) {
  color: #1a365d;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px !important;
}

:deep(.ant-card-meta-description) {
  color: #666;
  font-size: 14px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-container {
    padding: 16px;
  }

  .admin-content {
    padding: 16px;
  }

  .admin-title {
    font-size: 24px;
  }

  .card-icon {
    height: 100px;
  }

  :deep(.anticon) {
    font-size: 36px;
  }
}

@media (max-width: 576px) {
  .admin-container {
    padding: 12px;
  }

  .admin-content {
    padding: 12px;
  }

  .admin-title {
    font-size: 20px;
  }
}
</style>

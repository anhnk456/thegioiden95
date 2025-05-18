<template>
  <div class="category-wrapper">
    <div class="category-container">
      <div class="category-header">
        <a
          @click="goSearchSpByDm(categoryId, categoryName)"
          class="category-title"
        >
          {{ categoryName }}
        </a>
        <div class="category-line"></div>
      </div>
      <Products :product-list="productList" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

import Products from "./products.vue";

const router = useRouter();

const props = defineProps({
  categoryName: {
    type: String,
    default: "Đèn Led",
  },
  productList: {
    type: Array,
    default: undefined,
  },
  categoryId: {
    type: Number,
    default: undefined,
  },
});

const goSearchSpByDm = (id, name) => {
  router.push({ path: "/search", query: { id, name } });
};
</script>

<style scoped>
.category-wrapper {
  width: 100%;
  margin: 10px 0;
  overflow: hidden;
}

.category-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding-bottom: 10px;
}

.category-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.category-header {
  padding: 12px 15px;
  background: #00a859;
  position: relative;
  margin-bottom: 8px;
  text-align: center;
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
  display: inline-block;
}

.category-title:hover {
  color: #e6fff2;
}

.category-line {
  display: none;
}

@media (max-width: 1024px) {
  .category-wrapper {
    margin: 8px 0;
  }

  .category-header {
    padding: 10px 12px;
  }

  .category-title {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .category-wrapper {
    margin: 6px 0;
  }

  .category-header {
    padding: 8px 10px;
  }

  .category-title {
    font-size: 14px;
  }
}
</style>

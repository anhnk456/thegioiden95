<template>
  <div class="wrapper">
    <div class="container">
      <div class="title">
        <a
          @click="goSearchSpByDm(categoryId, categoryName)"
          style="font-weight: bold; font-size: 2rem; line-height: 2rem"
        >
          {{ categoryName }}
        </a>
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
    type: Number,
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
.wrapper {
  padding: 0 60px;
  margin-top: 60px;
}
.wrapper .container {
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  overflow-x: scroll;
  overflow-y: hidden;
}

.wrapper .container .title {
  padding: 11px 20px;
  background: #f5f7fd;
  border-radius: 10px;
}
</style>

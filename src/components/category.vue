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
import { ref, watch } from "vue";

import { getSpByDm } from "@/api/den-led.js";
import { useRouter } from "vue-router";

import Products from "./products.vue";

const router = useRouter();

const productList = ref();

const props = defineProps({
  categoryName: {
    type: String,
    default: "Đèn Led",
  },
  categoryId: {
    type: Number,
    default: undefined,
  },
});

const goSearchSpByDm = (id, name) => {
  router.push({ path: "/search", query: { id, name } });
};

watch(
  () => props.categoryId,
  async (value) => {
    if (value) {
      const params = {
        page: 0,
        size: 10,
        idDanhMuc: value,
      };
      const res = await getSpByDm(params);
      productList.value = res.data.splice(0, 4);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.wrapper {
  padding: 0 60px;
  margin-top: 60px;
}
.wrapper .container {
  border: 1px solid #e5e5e5;
  border-radius: 10px;
}

.wrapper .container .title {
  padding: 11px 20px;
  background: #f5f7fd;
  border-radius: 10px;
}
</style>

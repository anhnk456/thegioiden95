<template>
  <a-row :span="24" class="content">
    <a-col
      v-for="(item, index) in productList"
      class="product"
      :key="index"
      :xl="6"
      :lg="6"
      :md="12"
      :sm="24"
      :xs="24"
    >
      <div>
        <img
          class="productImg"
          :src="item.linkAnhChinh"
          alt="Ảnh không tồn tại"
          @click="goDetailSp(item.id)"
        />
      </div>
      <h3 class="productTitle">
        {{ item.tenSanPham }}
      </h3>
      <div class="productPrice">
        <span class="current-price">{{ item.giaSp }}</span>
      </div>
    </a-col>
  </a-row>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  productList: Array,
});

const goDetailSp = (id) => {
  router.push({ path: "/detail", query: { id } });
};
</script>

<style scoped>
.product {
  border: 1px solid #e5e5e5;
  overflow: hidden;
  animation: mymoveProduct 2s linear;
  transition: 0.2s linear;
}

.product:hover {
  transition: 0.2s linear;
  border: 1px solid black;
}

.productImg {
  width: 100%;
  box-sizing: border-box;
  transition: all 0.6s linear;
}
.productImg:hover {
  cursor: pointer;
  scale: 1.05;
}
.productTitle {
  margin: 10px 0 10px 10px;
}
.productTitle:hover {
  cursor: pointer;
  transition: 0.5s linear;
  color: #00a859;
}
.productPrice {
  color: #00a859;
  font-weight: bold;
  margin: 0 0 20px 10px;
  font-size: large;
  cursor: pointer;
}
</style>

<template>
  <a-row v-if="isSearch" :span="24" class="content">
    <a-col
      v-for="(item, index) in productList"
      class="product"
      :key="index"
      :xl="4"
      :lg="6"
      :md="8"
      :sm="12"
      :xs="12"
    >
      <div>
        <img
          class="productImg"
          :src="item.linkAnhChinh"
          alt="Ảnh không tồn tại"
          @click="goDetailSp(item.id)"
        />
      </div>
      <div class="productTitle">
        {{ item.tenSanPham }}
      </div>
      <div style="margin: 1rem" v-if="listCongSuat(item.congSuat)">
        <a-tag
          v-for="(item, index) in listCongSuat(item.congSuat)"
          :key="index"
        >
          {{ item }}</a-tag
        >
      </div>
      <div class="productPrice">
        <span class="current-price">{{ numberToVndCurrency(item.giaSp) }}</span>
      </div>
    </a-col>
  </a-row>
  <a-flex
    v-else
    :style="{
      width: `${productList?.length * witdhProduct?.replace('px', '')}px`,
    }"
  >
    <div
      v-for="(item, index) in productList"
      class="product"
      :style="{ width: witdhProduct }"
      :key="index"
    >
      <div>
        <img
          class="productImg"
          :src="item.linkAnhChinh"
          alt="Ảnh không tồn tại"
          @click="goDetailSp(item.id)"
        />
      </div>
      <div class="productTitle">
        {{ item.tenSanPham }}
      </div>
      <div style="margin: 1rem" v-if="listCongSuat(item.congSuat)">
        <a-tag
          v-for="(item, index) in listCongSuat(item.congSuat)"
          :key="index"
        >
          {{ item }}</a-tag
        >
      </div>
      <div class="productPrice">
        <span class="current-price">{{ numberToVndCurrency(item.giaSp) }}</span>
      </div>
    </div>
  </a-flex>
</template>

<script setup>
import { numberToVndCurrency } from "@/until/format";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  productList: Array,
  isSearch: Boolean,
});

const listCongSuat = (value) => {
  if (!value) return [];

  return value.split("-");
};

const goDetailSp = (id) => {
  router.push({ path: "/detail", query: { id } });
};

const witdhProduct = computed(() => {
  const fullWithd = +window.innerWidth;

  if (fullWithd > 1200) {
    return (fullWithd - 120) / 5 + "px";
  }
  if (fullWithd > 960) {
    return (fullWithd - 120) / 3 + "px";
  }
  if (fullWithd > 750) {
    return (fullWithd - 120) / 2 + "px";
  }

  return (fullWithd - 120) / 1 + "px";
});
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

@media only screen and (min-width: 1200px) {
  .productImg {
    width: 100%;
    box-sizing: border-box;
    transition: all 0.6s linear;
  }
}

@media only screen and (min-width: 900px) and (max-width: 1199px) {
  .productImg {
    width: 100%;
    box-sizing: border-box;
    transition: all 0.6s linear;
  }
}

@media only screen and (min-width: 100px) and (max-width: 899px) {
  .productImg {
    width: 100%;
    box-sizing: border-box;
    transition: all 0.6s linear;
  }
}
</style>

<template>
  <div>
    <Header ref="headerRef" />
    <div class="result-search">
      <h3 style="font-size: 2rem">Kết quả tìm kiếm</h3>
      <div style="margin-top: 20px">
        <h3 style="font-size: 2rem">
          Tất cả / {{ route.query?.value ? "Từ khóa:" : "Danh mục:" }} :
          {{ route.query?.value || route.query?.name }}
        </h3>
      </div>
      <div v-if="dataSearch.length === 0" style="margin-top: 20px">
        <h3 style="font-size: 2rem">Không tìm thấy sản phẩm nào</h3>
      </div>
    </div>
    <div class="wrapper">
      <div class="product">
        <Products is-search :product-list="dataSearch" />
      </div>
      <div style="display: flex; justify-content: center; margin: 30px 0">
        <a-pagination
          v-model:current="current"
          :total="total"
          @change="handleChangePage"
        />
      </div>
    </div>
    <FooterVue />
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

import Header from "@/components/header.vue";
import Products from "@/components/products.vue";
import { search } from "@/api/den-led.js";

import { useRoute } from "vue-router";
import FooterVue from "@/components/footer.vue";

const route = useRoute();

const current = ref(1);
const headerRef = ref();

const dataSearch = ref([]);

const total = computed(() => dataSearch.value[0]?.totalElement || 0);

const handleChangePage = async () => {
  const paramsUrl = route.query;

  if (paramsUrl.value) {
    const params = {
      page: current.value - 1,
      size: 10,
      tenSanPham: paramsUrl.value,
    };
    const res = await search(params);
    dataSearch.value = res.data;
  } else {
    const params = {
      page: current.value - 1,
      size: 10,
      idDanhMuc: paramsUrl.id,
    };
    const res = await search(params);
    dataSearch.value = res.data;
  }
};

watch(
  () => route.query,
  async (paramsUrl) => {
    if (paramsUrl.value) {
      const params = {
        page: current.value - 1,
        size: 10,
        tenSanPham: paramsUrl.value,
      };
      const res = await search(params);
      dataSearch.value = res.data;
    } else {
      const params = {
        page: current.value - 1,
        size: 10,
        idDanhMuc: paramsUrl.id,
      };
      const res = await search(params);
      dataSearch.value = res.data;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style scoped>
.wrapper {
  padding: 0 60px;
  margin-top: 60px;
}
.result-search {
  text-align: center;
  margin: 20px 0;
}
.result-search h3 {
  font-weight: bold;
}
.search {
  width: 100%;
  margin-bottom: 60px;
}
</style>

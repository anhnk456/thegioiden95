<template>
  <a-spin :spinning="loading">
    <Header ref="headerRef" />
    <div class="result-search">
      <h3 style="font-size: 2rem">Kết quả tìm kiếm</h3>
      <div style="margin-top: 20px">
        <h3 style="font-size: 2rem">
          Tất cả / {{ route.query?.value ? "Từ khóa" : "Danh mục" }} :
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
          :pageSize="size"
          @change="handleChangePage"
        />
      </div>
    </div>
    <FooterVue />
  </a-spin>
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
const size = ref(24);
const headerRef = ref();
const loading = ref(false);

const dataSearch = ref([]);

const total = computed(() => dataSearch.value[0]?.totalElement || 0);

const handleChangePage = async () => {
  loading.value = true;

  try {
    const { query } = route;
    const { value, id } = query;

    const params = {
      page: current.value - 1,
      size: size.value,
      ...(value ? { tenSanPham: value } : { idDanhMuc: id }),
    };

    const { data } = await search(params);
    dataSearch.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.query,
  async (query) => {
    const { value, id } = query;
    const params = {
      page: current.value - 1,
      size: size.value,
      ...(value ? { tenSanPham: value } : { idDanhMuc: id }),
    };

    try {
      loading.value = true;
      const { data } = await search(params);
      dataSearch.value = data;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
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

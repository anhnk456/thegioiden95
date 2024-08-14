<script setup>
import { onMounted, ref, computed } from "vue";

import HeaderVue from "@/components/header.vue";
import CarouselVue from "@/components/carousel.vue";
import Category from "@/components/category.vue";
import FooterVue from "@/components/footer.vue";
import AboutVue from "@/components/about.vue";
import { getTrangChu, getAllSp } from "@/api/den-led.js";
import Products from "@/components/products.vue";

const loading = ref(false);
const dataSearch = ref([]);
const categoryList = ref([]);
const current = ref(1);
const size = ref(36);

const total = computed(() => dataSearch.value[0]?.totalElement || 0);

const handleChangePage = async () => {
  loading.value = true;

  try {
    const params = {
      page: current.value - 1,
      size: size.value,
    };

    const { data } = await getAllSp(params);
    dataSearch.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    const res1 = await getAllSp({
      page: 0,
      size: size.value,
    });
    const res2 = await getTrangChu();
    dataSearch.value = res1.data;
    categoryList.value = res2.data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <HeaderVue />
    <CarouselVue />
    <Category
      v-for="(item, index) in categoryList"
      :key="index"
      :category-name="item.danhMucSanPham?.tenDanhMuc"
      :category-id="item.danhMucSanPham?.id"
      :product-list="item.listSanPham"
    />
    <!-- <a-spin :spinning="loading">
      <div class="wrapper">
        <div class="product">
          <Products is-search :product-list="dataSearch" />
        </div>
        <div style="display: flex; justify-content: center; margin: 30px 0">
          <a-pagination
            v-model:current="current"
            :showSizeChanger="false"
            :total="total"
            :pageSize="size"
            @change="handleChangePage"
          />
        </div>
      </div>
    </a-spin> -->
    <AboutVue />
    <FooterVue />
  </div>
</template>

<style scoped>
.wrapper {
  padding: 0 60px;
  margin-top: 60px;
}
</style>

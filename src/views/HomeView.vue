<script setup>
import { onMounted, ref } from "vue";

import HeaderVue from "@/components/header.vue";
import CarouselVue from "@/components/carousel.vue";
import Category from "@/components/category.vue";
import { getAllDanhMuc } from "@/api/den-led.js";

const categoryList = ref([]);

onMounted(async () => {
  const res = await getAllDanhMuc();
  categoryList.value = res.data.splice(0, 4);
});
</script>

<template>
  <div style="padding-bottom: 40px">
    <HeaderVue />
    <CarouselVue />
    <Category
      v-for="(item, index) in categoryList"
      :key="index"
      :category-id="item.id"
      :category-name="item.tenDanhMuc"
    />
  </div>
</template>

<style scoped></style>

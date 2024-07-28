<template>
  <div>
    <a-carousel arrows>
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <left-circle-outlined />
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 10px">
          <right-circle-outlined />
        </div>
      </template>
      <div v-for="(item, index) in listBanner" :key="index">
        <img class="img-carousel" :src="item.anhBanner" alt="" />
      </div>
    </a-carousel>
  </div>
</template>
<script setup>
import { getAllBanner } from "@/api/den-led";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons-vue";
import { onMounted, ref } from "vue";

const listBanner = ref([]);

onMounted(async () => {
  const res = await getAllBanner();

  listBanner.value = res.data;
});
</script>
<style scoped>
/* For demo */
:deep(.slick-slide) {
  text-align: center;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}
:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}
:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #fff;
  opacity: 0.5;
}

:deep(.slick-slide h3) {
  color: #fff;
}

.img-carousel {
  width: 100%;
  height: 650px;
  object-fit: fill;
}
</style>

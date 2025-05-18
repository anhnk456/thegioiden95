<template>
  <div class="carousel-container">
    <a-carousel arrows autoplay :autoplay-speed="5000">
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
      <div v-for="(item, index) in listBanner" :key="index" class="banner-slide">
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
.carousel-container {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  overflow: hidden;
  position: relative;
}

.banner-slide {
  width: 100%;
  height: 100%;
}

/* For demo */
:deep(.slick-slide) {
  text-align: center;
  background: #364d79;
  overflow: hidden;
  line-height: normal;
}

:deep(.slick-slider) {
  width: 100%;
}

:deep(.slick-list) {
  width: 100%;
}

:deep(.slick-track) {
  width: 100%;
}

:deep(.slick-arrow.custom-slick-arrow) {
  width: 35px;
  height: 35px;
  font-size: 35px;
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
  width: 100vw;
  height: calc(100vh - 80px); /* Trừ đi chiều cao của header nếu có */
  object-fit: cover;
  display: block;
}

/*  Mobile & Tablet */
@media (max-width: 63.9375em) {
  .img-carousel {
    width: 100vw;
    height: 300px;
    object-fit: cover;
  }
}
</style>

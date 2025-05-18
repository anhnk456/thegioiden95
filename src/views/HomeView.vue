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

// Thêm computed property để lọc các danh mục có sản phẩm
const filteredCategories = computed(() => {
  return categoryList.value.filter(item => {
    return item.listSanPham && Array.isArray(item.listSanPham) && item.listSanPham.length > 0;
  });
});

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
  <div class="home">
    <HeaderVue />
    <div class="banner-container">
      <CarouselVue />
    </div>
    <div class="main-content">
      <div class="categories-container">
        <Category
          v-for="(item, index) in filteredCategories"
          :key="index"
          :category-name="item.danhMucSanPham?.tenDanhMuc"
          :category-id="item.danhMucSanPham?.id"
          :product-list="item.listSanPham"
          class="category-section"
        />
      </div>
      <AboutVue class="about-section" />
    </div>
    <FooterVue />
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.banner-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 15px;
  margin-bottom: 20px;
}

.main-content {
  flex: 1;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 15px;
  overflow-x: hidden;
}

.categories-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.category-section {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
  width: 100%;
}

.about-section {
  margin-top: 30px;
  padding: 40px;
  border-radius: 12px;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1400px) {
  .main-content {
    max-width: 1200px;
  }
}

@media (max-width: 1200px) {
  .main-content {
    max-width: 960px;
  }
}

@media (max-width: 992px) {
  .main-content {
    padding: 0 10px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 8px;
  }

  .about-section {
    margin: 40px 0;
    padding: 24px;
  }
}
</style>

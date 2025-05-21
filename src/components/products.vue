<template>
  <div class="products-container">
    <button class="nav-button prev" @click="scrollLeft" :disabled="isAtStart">
      <left-outlined />
    </button>
    <div :class="['products-grid', { 'search-grid': isSearch }]" ref="productsGrid">
      <div
        v-for="(item, index) in productList"
        class="product-card"
        :key="index"
      >
        <div class="product-inner">
          <div class="product-image-wrapper">
            <img
              class="product-image"
              :src="item.linkAnhChinh"
              :alt="item.tenSanPham"
              @click="goDetailSp(item.id)"
            />
            <div class="product-overlay">
              <div class="product-actions">
                <button class="view-details" @click="goDetailSp(item.id)">
                  Xem chi tiết
                </button>
                <button class="add-to-cart" @click.stop="addToCart(item)">
                  <shopping-cart-outlined />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-title" @click="goDetailSp(item.id)">
              {{ item.tenSanPham }}
            </h3>
            <div class="product-tags" v-if="listCongSuat(item.congSuat)">
              <a-tag
                v-for="(power, idx) in listCongSuat(item.congSuat)"
                :key="idx"
                class="power-tag"
              >
                {{ power }}
              </a-tag>
            </div>
            <div class="product-price">
              {{ numberToVndCurrency(item.giaSp) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="nav-button next" @click="scrollRight" :disabled="isAtEnd">
      <right-outlined />
    </button>
  </div>
</template>

<script setup>
import { numberToVndCurrency } from "@/until/format";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from '@/store/cart';
import { message } from 'ant-design-vue';
import { ShoppingCartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const cartStore = useCartStore();
const productsGrid = ref(null);
const scrollPosition = ref(0);

const props = defineProps({
  productList: Array,
  isSearch: Boolean,
});

const isAtStart = computed(() => scrollPosition.value <= 0);
const isAtEnd = computed(() => {
  if (!productsGrid.value) return true;
  return scrollPosition.value >= productsGrid.value.scrollWidth - productsGrid.value.clientWidth;
});

const scrollLeft = () => {
  if (productsGrid.value) {
    const cardWidth = productsGrid.value.clientWidth / 5;
    const scrollAmount = cardWidth * 5;
    productsGrid.value.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }
};

const scrollRight = () => {
  if (productsGrid.value) {
    const cardWidth = productsGrid.value.clientWidth / 5;
    const scrollAmount = cardWidth * 5;
    productsGrid.value.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
};

const handleScroll = () => {
  if (productsGrid.value) {
    scrollPosition.value = productsGrid.value.scrollLeft;
  }
};

onMounted(() => {
  if (productsGrid.value) {
    productsGrid.value.addEventListener('scroll', handleScroll);
  }
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

const addToCart = (product) => {
  cartStore.addToCart(product);
  message.success('Đã thêm vào giỏ hàng');
};
</script>

<style scoped>
.products-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 25px;
}

.products-grid {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  overflow: hidden;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.products-grid::-webkit-scrollbar {
  display: none;
}

.product-card {
  flex: 0 0 calc(20% - 19.2px); /* 20% width for 5 items, accounting for gap */
  min-width: calc(20% - 19.2px);
  background: white;
  transition: all 0.3s ease;
}

.product-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-inner:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 25px;
  height: 25px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 168, 89, 0.8);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 2;
  font-size: 12px;
  padding: 0;
}

.nav-button.prev {
  left: 0;
}

.nav-button.next {
  right: 0;
}

.nav-button:hover {
  background: rgba(0, 168, 89, 1);
}

.nav-button:disabled {
  background: rgba(0, 0, 0, 0.1);
  cursor: not-allowed;
  opacity: 0.5;
}

.product-image-wrapper {
  position: relative;
  overflow: hidden;
  padding-top: 100%;
  background: #f8f9fa;
}

.product-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  object-fit: contain;
  object-position: center;
  transition: transform 0.5s ease;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
}

.product-image-wrapper:hover .product-overlay {
  opacity: 1;
}

.product-image-wrapper:hover .product-image {
  transform: translate(-50%, -50%) scale(1.1);
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.product-image-wrapper:hover .product-actions {
  transform: translateY(0);
}

.view-details,
.add-to-cart {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.view-details {
  background: #00a859;
  color: white;
}

.view-details:hover {
  background: #008c4d;
}

.add-to-cart {
  background: white;
  color: #2c3e50;
}

.add-to-cart:hover {
  background: #f8f9fa;
  color: #00a859;
}

.product-info {
  padding: 12px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 120px;
}

.product-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  cursor: pointer;
  transition: color 0.2s ease;
}

.product-title:hover {
  color: #00a859;
}

.product-tags {
  margin-bottom: 8px;
}

.power-tag {
  margin: 0 4px 4px 0;
  background: #f0f8f3;
  border-color: #e0f0e6;
  color: #00a859;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.product-price {
  font-size: 16px;
  font-weight: 700;
  color: #00a859;
  margin-top: auto;
}

@media (max-width: 1400px) {
  .products-container {
    padding: 0 20px;
  }
  .product-card {
    flex: 0 0 calc(25% - 15px);
    min-width: calc(25% - 15px);
  }
}

@media (max-width: 1200px) {
  .products-container {
    padding: 0 15px;
  }
  .product-card {
    flex: 0 0 calc(33.333% - 13.33px);
    min-width: calc(33.333% - 13.33px);
  }
  .product-info {
    min-height: 110px;
  }
  
  .product-title {
    font-size: 13px;
    height: 36px;
  }
}

@media (max-width: 768px) {
  /* Trang chủ: slider ngang 2 sản phẩm */
  .products-grid {
    display: flex !important;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 10px;
    width: 100%;
  }
  .products-grid .product-card {
    min-width: 50vw !important;
    max-width: 50vw !important;
    scroll-snap-align: start;
  }
  /* Nút mũi tên chỉ hiện trên trang chủ */
  .products-container:not(.search-mode) .nav-button {
    display: flex !important;
    align-items: center;
    justify-content: center;
    z-index: 10;
    top: 50%;
    transform: translateY(-50%);
  }
  .nav-button.prev { left: 4px !important; }
  .nav-button.next { right: 4px !important; }

  /* Trang search: lưới 2 cột, nhiều hàng */
  .search-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 10px;
    width: 100%;
    overflow-x: unset;
    scroll-snap-type: none;
  }
  .search-grid .product-card {
    width: 100% !important;
    min-width: unset !important;
    max-width: unset !important;
    scroll-snap-align: unset;
  }
  /* Ẩn nút mũi tên khi là search */
  .products-container.search-mode .nav-button {
    display: none !important;
  }
  .product-info {
    min-height: 100px;
    padding: 10px;
  }
  
  .product-title {
    font-size: 12px;
    height: 34px;
    margin-bottom: 6px;
  }
  
  .product-price {
    font-size: 14px;
  }
  
  .power-tag {
    font-size: 11px;
    padding: 1px 6px;
  }
}

.search-grid {
  display: grid !important;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, auto);
  gap: 20px;
  overflow: visible;
  width: 100%;
}
.search-grid .product-card {
  width: 100%;
  min-width: 0;
}
.search-grid .product-image-wrapper {
  width: 100%;
  height: 220px;
  padding-top: 0;
}
.search-grid .product-image {
  width: 100%;
  height: 100%;
}

/* Ẩn nút scroll khi search */
.search-grid ~ .nav-button.prev,
.search-grid ~ .nav-button.next {
  display: none !important;
}
</style>

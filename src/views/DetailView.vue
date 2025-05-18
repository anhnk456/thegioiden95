<template>
  <a-spin :spinning="loading">
    <div style="padding-bottom: 40px">
      <HeaderVue />
      <a-breadcrumb style="background-color: #e5e5e5">
        <a-breadcrumb-item style="padding-left: 60px"
          ><a href="/">Trang chủ</a></a-breadcrumb-item
        >
        <a-breadcrumb-item v-for="(item, index) in listBreadcrumb" :key="index">
          <a
            v-if="item.type == 'DANH_MUC'"
            @click="goSearchSpByDm(item.id, item.name)"
            >{{ item.name }}</a
          >
          <span v-else>{{ item.name }}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div class="product">
        <a-row :gutter="20" :span="24">
          <a-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
            <a-carousel
              style="margin-top: 2rem"
              arrows
              dots-class="slick-dots slick-thumb"
            >
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
              <template #customPaging="props">
                <a>
                  <img :src="getImgUrl(props.i)" />
                </a>
              </template>
              <div v-for="(image, index) in listImgProduct" :key="index">
                <img :src="image" />
              </div>
            </a-carousel>
          </a-col>
          <a-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
            <div class="product-title">
              <a-space>
                <h3 style="font-size: 2rem">
                  {{ detailImg?.tenSanPham.toUpperCase() }}
                </h3>
                <a-tag color="green">Còn hàng</a-tag>
              </a-space>
            </div>
            <div class="product-brand">
              <a-space>
                <span> Thương hiệu: </span> <a>{{ detailImg?.thuongHieu }}</a> |
                <span>Mã SP:</span>
                <span>{{ detailImg?.maSp }}</span>
              </a-space>
            </div>
            <div class="product-price">
              <a-space>
                <div class="product-price-sale">
                  {{ numberToVndCurrency(detailImg?.giaSp) }}
                </div>
                <!-- <div class="product-price-original">{{ detailImg?.giaSp }}</div> -->
                <!-- <div class="product-price-percent">(Đã bao gồm VAT)</div> -->
              </a-space>
            </div>
            <div class="mt-2">
              <a-space>
                <h4>Hiệu suất:</h4>
                <span>{{ detailImg?.hieuSuat }}</span>
              </a-space>
            </div>
            <div class="mt-1">
              <a-space>
                <h4>Chỉ số hoàn màu:</h4>
                <span>{{ detailImg?.chiSoHoanMau }}</span>
              </a-space>
            </div>
            <div class="mt-1">
              <a-space>
                <h4>Góc chiếu:</h4>
                <span>{{ detailImg?.gocChieu }}</span>
              </a-space>
              <div class="mt-1">
                <a-space>
                  <h4>Tuổi thọ:</h4>
                  <span>{{ detailImg?.tuoiTho }}</span>
                </a-space>
              </div>
            </div>
            <a-space class="mt-4">
              <h3>{{ listCongSuat[0]?.tenPhanLoai || "Công suất" }}</h3>
              <button
                v-for="(item, index) in listCongSuat"
                :key="index"
                @click="changeGiaSp(item)"
              >
                {{ item?.groupValue }}
              </button>
            </a-space>
            <div />
            <a-space class="mt-2">
              <h3>{{ listKichThuoc[0]?.tenPhanLoai || "Kích thước" }}</h3>
              <button v-for="(item, index) in listKichThuoc" :key="index">
                {{ item?.groupValue }}
              </button>
            </a-space>
            <div />
            <a-space v-if="listDynamic.length > 0" class="mt-2">
              <h3>{{ listDynamic[0]?.tenPhanLoai }}</h3>
              <button v-for="(item, index) in listDynamic" :key="index">
                {{ item?.groupValue }}
              </button>
            </a-space>
            <div />
            <div class="product-quantity mt-2">
              <h3>Số lượng</h3>
              <a-space>
                <a-input-number 
                  v-model:value="quantity"
                  :min="1" 
                  :max="100"
                  size="large"
                />
                <a class="calculator-link">Click vào đây để tính toán số lượng đèn</a>
              </a-space>
            </div>
            <div class="product-actions mt-4">
              <a-button
                size="large"
                type="primary"
                @click="addToCart"
                :loading="loading"
                class="cart-button"
              >
                <shopping-cart-outlined />
                Thêm vào giỏ hàng
              </a-button>
              <a-button 
                size="large" 
                type="primary" 
                danger
                class="buy-button"
              >
                Mua ngay
              </a-button>
            </div>
            <div class="product-info-buttons mt-4">
              <a-button
                @click="() => (openModal = true)"
                size="large"
                class="info-button"
              >
                Mô tả sản phẩm
              </a-button>
              <a-button 
                size="large"
                class="info-button"
              >
                Thông số kỹ thuật
              </a-button>
            </div>
          </a-col>
        </a-row>
        <!-- <Category /> -->
      </div>
      <a-modal width="60%" v-model:open="openModal" title="MÔ TẢ VỀ SẢN PHẨM">
        <div>
          {{ detailImg.moTa }}
        </div>
        <template #footer>
          <a-button key="back" @click="() => (openModal = false)"
            >Đóng</a-button
          >
        </template>
      </a-modal>
      <FooterVue />
    </div>
  </a-spin>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, nextTick, onMounted, ref } from "vue";

import Category from "@/components/category.vue";
import HeaderVue from "@/components/header.vue";
import FooterVue from "@/components/footer.vue";
import { detailProduct } from "@/api/den-led.js";
import { formatBreadcrumb, numberToVndCurrency } from "@/until/format";
import { LeftCircleOutlined, RightCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons-vue";
import { useCartStore } from '@/store/cart';
import { message } from 'ant-design-vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const idImage = computed(() => route.query.id);

const listImgProduct = ref([]);
const listCongSuat = ref([]);
const listKichThuoc = ref([]);
const listDynamic = ref([]);
const detailImg = ref();
const listBreadcrumb = ref([]);
const openModal = ref(false);
const loading = ref(false);
const quantity = ref(1);

const getImgUrl = (i) => {
  return listImgProduct.value[i];
};

const goSearchSpByDm = (id, name) => {
  router.push({ path: "/search", query: { id, name } });
};

const changeGiaSp = (item) => {
  detailImg.value.giaSp = item.giaSanPham;
};

const addToCart = () => {
  if (detailImg.value) {
    const productToAdd = {
      ...detailImg.value,
      quantity: quantity.value
    };
    cartStore.addToCart(productToAdd);
    message.success('Đã thêm vào giỏ hàng');
    cartStore.toggleCart();
  }
};

onMounted(async () => {
  try {
    loading.value = true;

    const res = await detailProduct({ id: idImage.value });
    detailImg.value = res.data.sanPham;
    listBreadcrumb.value = formatBreadcrumb(res.data);

    if (res.data.sanPham.linkAnhChinh) {
      listImgProduct.value.push(res.data.sanPham.linkAnhChinh);
    }

    if (res.data.listAnh) {
      const listAnhFilter = res.data.listAnh.map((item) => item.linkAnh);
      listImgProduct.value = [...listImgProduct.value, ...listAnhFilter];
    }

    if (res.data.listCongSuat.length > 0) {
      const list = res.data.listCongSuat;
      list.forEach((item) => {
        listCongSuat.value.push({
          giaSanPham: item.giaTien,
          groupValue: item.groupValue,
        });
      });
    }

    if (res.data.listKichThuoc.length > 0) {
      const list = res.data.listKichThuoc;
      list.forEach((item) => {
        listKichThuoc.value.push({
          groupValue: item.groupValue,
        });
      });
    }

    if (res.data.listDynamic.length > 0) {
      const list = res.data.listDynamic;
      list.forEach((item) => {
        listDynamic.value.push({
          groupValue: item.groupValue,
          tenPhanLoai: item.tenPhanLoai,
        });
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.product {
  padding: 0 120px;
}
.product-title {
  margin-top: 20px;
}
.product-brand {
  margin-top: 1rem;
}
.product-price {
  margin-top: 2rem;
}

.product-price-sale {
  font-weight: 700;
  font-size: 2rem;
  color: red;
}
.product-price-original {
  margin-left: 1rem;
  text-decoration: line-through;
}

.product-description-content {
  font-size: 1.5rem;
}
.radio-btn {
  transform: scale(0.85);
  border-radius: 10%;
}

:deep(.slick-dots) {
  position: relative;
  height: auto;
}
:deep(.slick-slide img) {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
/* :deep(.slick-arrow) {
  display: none !important;
} */
:deep(.slick-thumb) {
  bottom: 0px;
}
:deep(.slick-thumb li) {
  width: 60px;
  height: 45px;
}
:deep(.slick-thumb li img) {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
  display: block;
}
:deep .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: black;
  background-color: rgba(31, 45, 61, 0.11);
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}
:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}
:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: black;
  opacity: 0.5;
}

.img-carousel {
  width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

@media (max-width: 63.9375em) {
  .product {
    padding: 0 1rem;
  }
  .product-title {
    margin-top: 40px;
  }
  :deep(.slick-slide img) {
    border: 5px solid #fff;
    display: block;
    margin: auto;
    max-width: 95%;
  }
}

.product-quantity {
  display: flex;
  align-items: center;
  gap: 16px;
}

.calculator-link {
  color: #00a859;
  text-decoration: underline;
  cursor: pointer;
}

.calculator-link:hover {
  color: #008c4d;
}

.product-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 0 20px;
}

.cart-button,
.buy-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cart-button {
  background: #00a859;
}

.cart-button:hover {
  background: #008c4d;
}

.product-info-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 0 20px;
}

.info-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
}
</style>

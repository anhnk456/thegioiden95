<template>
  <div style="padding-bottom: 40px">
    <HeaderVue />
    <div class="product">
      <a-row :gutter="20" :span="24">
        <a-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
          <a-carousel style="margin-top: 2rem" arrows>
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
            <div v-for="(item, index) in listImgProduct" :key="index">
              <img class="img-carousel" :src="item" alt="" />
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
              <div class="product-price-sale">{{ detailImg?.giaSp }}</div>
              <!-- <div class="product-price-original">{{ detailImg?.giaSp }}</div> -->
              <div class="product-price-percent">(Đã bao gồm VAT)</div>
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
            <h3>Công suất</h3>
            <span> {{ detailImg?.congSuat }}</span>
          </a-space>
          <div />
          <a-space class="mt-2">
            <h3>Ánh sáng</h3>
            <span>{{ detailImg?.anhSang }}</span>
          </a-space>
          <div />
          <a-space class="product-amout mt-2">
            <h3>Số lượng</h3>
            <a-input-number class="radio-btn" :min="1" :max="100" />
            <a style="margin-left: 2rem"
              >Click vào đây để tính toán số lượng đèn</a
            >
          </a-space>
          <div />
          <div style="padding: 0 20px" class="product-btn mt-4">
            <div>
              <a-button
                size="large"
                type="primary"
                style="width: 49%; margin-right: 2%"
                >Thêm vào giỏ hàng</a-button
              >
              <a-button size="large" type="primary" danger style="width: 49%"
                >Mua ngay</a-button
              >
            </div>
            <div style="margin-top: 2rem">
              <a-button
                @click="() => (openModal = true)"
                size="large"
                style="width: 49%; margin-right: 2%"
                >Mô tả sản phẩm</a-button
              >
              <a-button size="large" style="width: 49%"
                >Thông số kỹ thuật</a-button
              >
            </div>
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
        <a-button key="back" @click="() => (openModal = false)">Đóng</a-button>
      </template>
    </a-modal>
    <FooterVue />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";

import Category from "@/components/category.vue";
import HeaderVue from "@/components/header.vue";
import FooterVue from "@/components/footer.vue";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons-vue";
import { detailProduct } from "@/api/den-led.js";

const route = useRoute();

const idImage = computed(() => route.query.id);

const listImgProduct = ref([]);
const detailImg = ref();
const value1 = ref();
const value2 = ref();
const openModal = ref(false);

onMounted(async () => {
  const res = await detailProduct({ id: idImage.value });
  detailImg.value = res.data.sanPham;

  if (res.data.sanPham.linkAnhChinh) {
    listImgProduct.value.push(res.data.sanPham.linkAnhChinh);
  }
  if (res.data.listAnh) {
    const listAnhFilter = res.data.listAnh.map((item) => item.linkAnh);
    listImgProduct.value = [...listImgProduct.value, ...listAnhFilter];
  }
});
</script>

<style scoped>
.product {
  padding: 0 60px;
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

:deep(.slick-slide) {
  text-align: center;
  background: white;
  overflow: hidden;
}

:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: rgb(68, 66, 66);
  background-color: rgba(31, 45, 61, 0.11);
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}
:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}
:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #1e1d1d;
  opacity: 0.5;
}

.img-carousel {
  width: 100%;
  max-height: 80vh;
  object-fit: contain;
}
</style>

<template>
  <div class="wrapper">
    <a-row>
      <a-col
        style="margin-bottom: 4rem"
        :xl="12"
        :lg="12"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <div>
          <img
            class="ls-is-cached lazyloaded"
            data-src="//theme.hstatic.net/200000072226/1000834016/14/ft_logo.png?v=2974"
            alt="Đèn LED - Đèn Trang trí - LED XANH"
            src="//theme.hstatic.net/200000072226/1000834016/14/ft_logo.png?v=2974"
          />
        </div>
        <h3 class="mt-2">CÔNG TY CP THƯƠNG MẠI VÀ XÂY DỰNG 138 VIỆT NAM</h3>
        <div class="mt-2">
          <a-space>
            <h3>Địa chỉ:</h3>
            <span>11C9 Geleximce Lê Trọng Tấn Hà Đông - Hà Nội</span>
          </a-space>
        </div>
        <div class="mt-2">
          <a-space>
            <h3>Số điện thoại:</h3>
            <span>098300662</span>
          </a-space>
        </div>
      </a-col>
      <a-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <a-row>
          <a-col span="12">
            <h3 style="font-size: 2rem">Chính sách & Quy định</h3>
            <div class="policy">Chính sách đổi trả</div>
            <div class="policy">Chính sách bảo hành</div>
            <div class="policy">Điều khoản dịch vụ</div>
            <div class="policy">Chính sách bảo mật</div>
            <div class="policy">Hướng dẫn mua hàng</div>
            <div class="policy">Kinh nghiệm mua hàng</div>
          </a-col>
          <a-col span="12">
            <h3 style="font-size: 2rem">Theo dõi chúng tôi trên</h3>
            <div>
              <a-space>
                <div>
                  <a-button shape="circle" class="mt-2" type="primary">
                    <template #icon>
                      <FacebookFilled />
                    </template>
                  </a-button>
                </div>
                <div class="social" style="margin-top: 1.5rem">Facebook</div>
              </a-space>
            </div>
            <div>
              <a-space>
                <div>
                  <a-button shape="circle" danger class="mt-2" type="primary">
                    <template #icon>
                      <YoutubeFilled />
                    </template>
                  </a-button>
                </div>
                <div class="social" style="margin-top: 1.5rem">Youtube</div>
              </a-space>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { FacebookFilled, YoutubeFilled } from "@ant-design/icons-vue";
</script>

<style scoped>
.wrapper {
  margin-top: 4rem;
  padding: 0 60px;
  margin-bottom: 2rem;
}
.policy {
  margin: 2rem 0;
  margin-left: 1rem;
}
.policy:hover {
  cursor: pointer;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

.social:hover {
  cursor: pointer;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}
</style>

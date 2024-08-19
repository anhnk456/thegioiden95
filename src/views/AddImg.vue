<template>
  <div>
    <Header ref="headerRef" />
    <div
      style="
        margin-bottom: 2rem;
        float: right;
        margin-top: 2rem;
        padding-right: 60px;
      "
    >
      <a-button @click="onOpen" type="primary">Thêm sản phẩm</a-button>
    </div>
    <div class="wrapper-table">
      <a-form ref="formRef" :model="formSearch">
        <a-row :gutter="20">
          <a-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
            <a-form-item label="Tên danh mục" name="tenDanhMuc">
              <a-select v-model:value="formSearch.tenDanhMuc">
                <a-select-option
                  v-for="(item, index) in categoryList"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.tenDanhMuc }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
            <a-form-item label="Tên sản phẩm" name="tenSanPham">
              <a-input v-model:value="formSearch.tenSanPham" />
            </a-form-item>
          </a-col>
          <a-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
            <a-button @click="onSearch"> Tìm kiếm</a-button>
            <a-button @click="clearDataSearch" danger style="margin-left: 1rem">
              Xóa tìm kiếm</a-button
            >
          </a-col>
        </a-row>
      </a-form>
      <a-table
        style="margin-top: 1rem"
        :dataSource="dataSource"
        :columns="columns"
        :loading="loadingTable"
        size="small"
        bordered
        :pagination="false"
      >
        <template #bodyCell="{ column, index, record }">
          <template v-if="column.dataIndex === 'stt'">
            <span>{{ index + 1 }}</span>
          </template>
          <template v-if="column.dataIndex === 'danhMucSanPhamId'">
            <span>{{ getTenDanhMuc(record.danhMucSanPhamId) }}</span>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a-button @click="onEdit(record)" size="small">Sửa</a-button>
              <a-button @click="onDelete(record)" size="small" danger
                >Xóa</a-button
              >
            </a-space>
          </template>
        </template>
      </a-table>
      <a-pagination
        style="float: right; margin-top: 1rem"
        v-model:current="current"
        @change="handleChangePage"
        :total="total"
        show-less-items
      />
    </div>
    <a-drawer title="Thêm danh mục" size="large" :open="open" @close="onClose">
      <a-spin :spinning="loadingDrawer">
        <a-form
          ref="formRef"
          :model="formAdd"
          style="margin-top: 4rem"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item
            label="Tên danh mục"
            name="danhMucSanPhamId"
            :rules="[{ required: true, message: 'Vui lòng chọn tên danh mục' }]"
          >
            <a-select v-model:value="formAdd.danhMucSanPhamId">
              <a-select-option
                v-for="(item, index) in categoryList"
                :key="index"
                :value="item.id"
              >
                {{ item.tenDanhMuc }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="Tên sản phẩm"
            name="tenSanPham"
            :rules="[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]"
          >
            <a-input v-model:value="formAdd.tenSanPham" />
          </a-form-item>
          <a-form-item label="Ảnh sản phẩm" name="anhSanPham">
            <a-upload
              :show-upload-list="false"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                Upload ảnh sản phẩm
              </a-button>
            </a-upload>
            <a-button @click="deteleImg" style="margin-left: 2rem" danger>
              Xóa ảnh này
            </a-button>
            <a-carousel
              :after-change="onChange"
              arrows
              style="margin-top: 2rem"
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
              <div v-for="(item, index) in listImgProduct" :key="index">
                <img class="img-carousel" :src="item" alt="" />
              </div>
            </a-carousel>
          </a-form-item>
          <a-form-item label="Thương hiệu" name="thuongHieu">
            <a-input v-model:value="formAdd.thuongHieu" />
          </a-form-item>
          <a-form-item label="Mã sản phẩm" name="maSp">
            <a-input v-model:value="formAdd.maSp" />
          </a-form-item>
          <a-form-item
            label="Giá sản phẩm"
            name="giaSp"
            :rules="[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]"
          >
            <a-input v-model:value="formAdd.giaSp" />
          </a-form-item>
          <a-form-item label="Hiệu suất" name="hieuSuat">
            <a-input v-model:value="formAdd.hieuSuat" />
          </a-form-item>
          <a-form-item label="Chỉ số hoàn màu" name="chiSoHoanMau">
            <a-input v-model:value="formAdd.chiSoHoanMau" />
          </a-form-item>
          <a-form-item label="Góc chiếu" name="gocChieu">
            <a-input v-model:value="formAdd.gocChieu" />
          </a-form-item>
          <a-form-item label="Tuổi thọ" name="tuoiTho">
            <a-input v-model:value="formAdd.tuoiTho" />
          </a-form-item>
          <a-form-item label="Công suất" name="congSuat">
            <a-input v-model:value="formAdd.congSuat" />
          </a-form-item>
          <a-form-item label="Giá công suất" name="giaCongSuat">
            <a-input v-model:value="formAdd.giaCongSuat" />
          </a-form-item>
          <a-form-item label="Kích thước" name="kichThuoc">
            <a-row :gutter="10" span="24">
              <a-col span="20">
                <a-input v-model:value="formAdd.kichThuoc"
              /></a-col>
              <a-col span="4">
                <a-button
                  :disabled="listDynamic.length > 0"
                  type="dashed"
                  block
                  @click="addDynamic"
                >
                  <PlusOutlined /> </a-button
              ></a-col>
            </a-row>
          </a-form-item>
          <div
            v-for="(item, index) in listDynamic"
            :key="index"
            style="margin-bottom: 20px; margin-left: 71px"
          >
            <a-row :gutter="10" span="24">
              <a-col span="6"
                ><a-input v-model:value="item.tenPhanLoai"> </a-input
              ></a-col>
              <a-col span="14"
                ><a-input v-model:value="item.groupValue"> </a-input
              ></a-col>
            </a-row>
          </div>
          <a-form-item label="Mô tả" name="moTa">
            <a-textarea v-model:value="formAdd.moTa" type="textarea" />
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" @click="submit">Xác nhận</a-button>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import {
  Upload,
  UploadChangeParam,
  UploadProps,
  message,
} from "ant-design-vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";

import Header from "@/components/header.vue";
import {
  search,
  addProduct,
  deleteProduct,
  editProduct,
  detailProduct,
} from "@/api/den-led";
import { storage } from "@/firebase";
import {
  ref as refFireBase,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

interface DynamicList {
  tenPhanLoai?: string;
  groupValue?: string;
}

const formAddInit = {
  id: "",
  danhMucSanPhamId: "",
  tenSanPham: "",
  moTa: "",
  thuongHieu: "",
  maSp: "",
  giaSp: "",
  anhSang: "",
  congSuat: "",
  tuoiTho: "",
  gocChieu: "",
  chiSoHoanMau: "",
  hieuSuat: "",
  giaCongSuat: "",
  kichThuoc: "",
};

const listDynamic = ref<DynamicList[]>([]);

const headerRef = ref();
const formRef = ref();

const open = ref(false);
const loadingTable = ref(false);
const loadingDrawer = ref(false);

const current = ref(1);
const indeximgInCarousel = ref();

const categoryList = ref([]);
const dataSource = ref([]);
const listImgProduct = ref([]);

const total = computed(() => dataSource.value[0]?.totalElement || 0);

const formAdd = ref({
  ...formAddInit,
});

const formSearch = reactive({
  page: 0,
  pageSize: 10,
  tenDanhMuc: "",
  tenSanPham: "",
});

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    width: 50,
  },
  {
    title: "Tên danh mục",
    dataIndex: "danhMucSanPhamId",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "tenSanPham",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
    width: 120,
  },
];

const addDynamic = () => {
  listDynamic.value.push({
    tenPhanLoai: "",
    groupValue: "",
  });
};

const fetch = async () => {
  try {
    loadingTable.value = true;
    const params = {
      page: formSearch.page,
      size: formSearch.pageSize,
      idDanhMuc: formSearch.tenDanhMuc,
      tenSanPham: formSearch.tenSanPham,
    };
    const res = await search(params);
    dataSource.value = res.data;
  } catch (error) {
    console.log(error);
  } finally {
    loadingTable.value = false;
  }
};

const getTenDanhMuc = (maDanhMuc) => {
  if (!categoryList.value.length) {
    categoryList.value = headerRef.value.getCategoryList();
  }

  return categoryList.value.find((item) => (item.id = maDanhMuc))?.tenDanhMuc;
};

const onOpen = () => {
  open.value = true;
  formAdd.value = {
    ...formAddInit,
  };
  listImgProduct.value = [];
  listDynamic.value = [];
};

const onClose = () => {
  open.value = false;
};

const onDelete = async (record) => {
  try {
    loadingTable.value = true;
    await deleteProduct(record.id);
    message.success("Xóa sản phẩm thành công");
    await fetch();
  } catch (error) {
    console.log(error);
  } finally {
    loadingTable.value = false;
  }
};

const onEdit = async (record) => {
  if (!record.id) return;

  open.value = true;
  listImgProduct.value = [];
  listDynamic.value = [];
  try {
    loadingDrawer.value = true;
    const res = await detailProduct({ id: record.id });
    formAdd.value = res.data.sanPham;

    if (res.data.listCongSuat.length > 0) {
      formAdd.value.giaCongSuat = res.data.listCongSuat
        .map((item) => item.giaTien)
        .join("-");
    }

    if (res.data.listDynamic.length > 0) {
      const list = res.data.listDynamic;

      listDynamic.value.push({
        tenPhanLoai: list[0].tenPhanLoai,
        groupValue: list.map((item) => item.groupValue).join("-"),
      });
    }

    if (res.data.sanPham.linkAnhChinh) {
      listImgProduct.value.push(res.data.sanPham.linkAnhChinh);
    }
    if (res.data.listAnh) {
      const listAnhFilter = res.data.listAnh.map((item) => item.linkAnh);
      listImgProduct.value = [...listImgProduct.value, ...listAnhFilter];
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadingDrawer.value = false;
  }
};

const getListPhanLoai = (value) => {
  if (!value) return;

  const congSuatList = value.congSuat?.split("-") || [];
  const giaCongSuatList = value.giaCongSuat?.split("-") || [];
  const kichThuocList = value.kichThuoc?.split("-") || [];
  const dynamicList = listDynamic.value[0]?.groupValue?.split("-") || [];

  if (congSuatList.length !== giaCongSuatList.length) {
    return false;
  }

  return {
    listCongSuat: congSuatList.map((item, index) => {
      return {
        tenPhanLoai: "congSuat",
        groupValue: item.trim(),
        giaTien: giaCongSuatList[index].trim(),
      };
    }),
    listKichThuoc: kichThuocList.map((item) => {
      return {
        tenPhanLoai: "kichThuoc",
        groupValue: item.trim(),
      };
    }),
    listDynamic: dynamicList.map((item) => {
      return {
        tenPhanLoai: listDynamic.value[0]?.tenPhanLoai,
        groupValue: item.trim(),
      };
    }),
  };
};

const submit = async () => {
  try {
    await formRef.value.validate();
    loadingDrawer.value = true;

    const phanLoaiList = getListPhanLoai(formAdd.value);

    if (!phanLoaiList) {
      message.success("Công suất và giá tiến công suất phải tương ứng");
      return;
    }

    if (formAdd.value.id) {
      const listAnhFilter = listImgProduct.value.map((item) => {
        return {
          linkAnh: item,
        };
      });
      const bodyRequest = {
        sanPham: {
          ...formAdd.value,
          linkAnhChinh: listAnhFilter[0].linkAnh,
        },
        listAnh: listAnhFilter.slice(1),
        ...phanLoaiList,
      };
      await editProduct(bodyRequest);
      message.success("Sửa sản phẩm thành công");
    } else {
      const listAnhFilter = listImgProduct.value.map((item) => {
        return {
          linkAnh: item,
        };
      });
      const bodyRequest = {
        sanPham: {
          ...formAdd.value,
          linkAnhChinh: listAnhFilter[0].linkAnh,
        },
        listAnh: listAnhFilter.slice(1),
        ...phanLoaiList,
      };
      await addProduct(bodyRequest);
      message.success("Thêm mới sản phẩm thành công");
    }
    onClose();
    await fetch();
  } catch (error) {
    console.log(error);
  } finally {
    loadingDrawer.value = false;
  }
};

const handleChangePage = async (page, pageSize) => {
  formSearch.page = page - 1;
  formSearch.pageSize = pageSize;
  await fetch();
};

const onSearch = async () => {
  formSearch.page = 0;
  formSearch.pageSize = 10;
  await fetch();
};

const clearDataSearch = async () => {
  formSearch.page = 0;
  formSearch.pageSize = 10;
  formSearch.tenDanhMuc = "";
  formSearch.tenSanPham = "";
  await fetch();
};

const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  const enableFilesUpload = ["pdf", "png", "jpg", "jpeg"];
  const fileName = file.name.replace(/^.*\./, "");
  const validFile = enableFilesUpload.includes(fileName);
  if (!validFile) {
    message.error(
      "File tải lên không hợp lệ, các file hợp lệ là ['pdf', 'png', 'jpg', 'jpeg'] "
    );
  }
  return validFile || Upload.LIST_IGNORE;
};

const handleChange = async ({ file }: UploadChangeParam) => {
  try {
    loadingDrawer.value = true;
    if (file.status !== "uploading") {
      const storageRef = refFireBase(storage, `img/${file.name}`);
      await uploadBytes(storageRef, file.originFileObj);
      const url = await getDownloadURL(
        refFireBase(storage, `img/${file.name}`)
      );
      listImgProduct.value.push(url);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadingDrawer.value = false;
  }
};

const onChange = (current: number) => {
  indeximgInCarousel.value = current;
};

const deteleImg = () => {
  listImgProduct.value.splice(indeximgInCarousel.value, 1);
};

onMounted(async () => {
  await fetch();
});
</script>

<style scoped>
.wrapper-table {
  padding: 60px;
}
:deep(.slick-slide) {
  text-align: center;
  height: 200px;
  background: white;
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
  object-fit: contain;
}
</style>

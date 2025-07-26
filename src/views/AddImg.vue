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
      <a-space>
        <a-upload
          :show-upload-list="false"
          :before-upload="beforeUploadExcel"
          @change="handleExcelChange"
          action="javascript:;"
        >
          <a-button type="primary">
            <upload-outlined></upload-outlined>
            Import Excel
          </a-button>
        </a-upload>
        <a-button @click="onOpen" type="primary">Thêm sản phẩm</a-button>
      </a-space>
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
    <a-drawer :title="title" size="large" :open="open" @close="onClose">
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
              action="javascript:;"
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
          <div style="margin-bottom: 20px; margin-left: 71px">
            <a-row :gutter="10" span="24">
              <a-col span="6">
                <a-input v-model:value="formAdd.tenCongSuat" placeholder="Nhập tên (ví dụ: Công suất)" />
              </a-col>
              <a-col span="14">
                <a-input v-model:value="formAdd.congSuat" placeholder="Nhập giá trị, cách nhau bằng dấu - (ví dụ: 10W-20W-30W)" />
              </a-col>
            </a-row>
          </div>
          <a-form-item label="Giá sản phẩm" name="giaCongSuat">
            <a-input v-model:value="formAdd.giaCongSuat" />
          </a-form-item>
          <div style="margin-bottom: 20px; margin-left: 71px">
            <a-row :gutter="10" span="24">
              <a-col span="6">
                <a-input v-model:value="formAdd.tenKichThuoc" placeholder="Nhập tên (ví dụ: Kích thước)" />
              </a-col>
              <a-col span="14">
                <a-input v-model:value="formAdd.kichThuoc" placeholder="Nhập giá trị, cách nhau bằng dấu - (ví dụ: 100-200-300)" />
              </a-col>
            </a-row>
          </div>
          <div style="margin-bottom: 20px; margin-left: 71px">
            <a-row :gutter="10" span="24">
              <a-col span="6">
                <a-input v-model:value="formAdd.tenDynamic" placeholder="Nhập tên (ví dụ: Màu sắc)" />
              </a-col>
              <a-col span="14">
                <a-input v-model:value="formAdd.valueDynamic" placeholder="Nhập giá trị, cách nhau bằng dấu - (ví dụ: Đỏ-Xanh-Vàng)" />
              </a-col>
            </a-row>
          </div>
          <div style="margin-bottom: 20px; margin-left: 71px">
            <a-row :gutter="10" span="24">
              <a-col span="6" style="display: flex; align-items: center;">
                <span>Giá sản phẩm (hiển thị ở trang chủ):</span>
              </a-col>
              <a-col span="14">
                <a-input-number v-model:value="formAdd.giaSp" :min="0" style="width: 100%" placeholder="Nhập giá sản phẩm" />
              </a-col>
            </a-row>
          </div>
          <a-form-item label="Mô tả" name="moTa">
            <a-textarea v-model:value="formAdd.moTa" type="textarea" />
          </a-form-item>
          <a-form-item label="Thông số kỹ thuật" name="thongSo">
            <a-textarea v-model:value="formAdd.thongSo" type="textarea" />
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" @click="submit">Xác nhận</a-button>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-drawer>
    <a-modal
      v-model:open="previewModalVisible"
      title="Xem trước dữ liệu Excel"
      width="80%"
      :footer="null"
    >
      <div v-if="excelPreviewData.length > 0">
        <a-table
          :columns="previewColumns"
          :dataSource="excelPreviewData"
          :pagination="false"
          :scroll="{ x: 1000 }"
        />
        <div style="margin-top: 16px; text-align: right">
          <a-space>
            <a-button @click="previewModalVisible = false">Hủy</a-button>
            <a-button type="primary" @click="confirmUpload" :loading="uploading">
              Xác nhận Upload
            </a-button>
          </a-space>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model:open="confirmDeleteVisible"
      title="Xác nhận xoá sản phẩm"
      :footer="null"
      @cancel="confirmDeleteVisible = false"
      closable
    >
      <span>Bạn có chắc chắn muốn xoá sản phẩm này không?</span>
      <div style="margin-top: 24px; text-align: right">
        <a-button @click="confirmDeleteVisible = false">Huỷ</a-button>
        <a-button type="primary" danger style="margin-left: 8px" @click="handleConfirmDelete">Xoá</a-button>
      </div>
    </a-modal>
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
import * as XLSX from 'xlsx';
import axiosInstance from '@/config/axios.config';
import { useCartStore } from '@/store/cart';
import { useRoute, useRouter } from 'vue-router';
import { getCurrentUser } from '@/api/auth';

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
  anhSang: "",
  tenCongSuat: "",
  congSuat: "",
  giaCongSuat: "",
  tenKichThuoc: "",
  kichThuoc: "",
  tenDynamic: "",
  valueDynamic: "",
  thongSo: "",
  giaSp: '',
};

const listDynamic = ref<DynamicList[]>([]);

const headerRef = ref();
const formRef = ref();
const title = computed(() => {
  return formAdd.value.id ? "Sửa sản phẩm" : "Thêm sản phẩm";
});

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
  return categoryList.value.find((item) => (item.id === maDanhMuc))?.tenDanhMuc;
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

const confirmDeleteVisible = ref(false);
const recordToDelete = ref(null);

const onDelete = (record) => {
  recordToDelete.value = record;
  confirmDeleteVisible.value = true;
};

const handleConfirmDelete = async () => {
  if (!recordToDelete.value) return;
  try {
    loadingTable.value = true;
    await deleteProduct(recordToDelete.value.id);
    message.success("Xóa sản phẩm thành công");
    await fetch();
  } catch (error) {
    console.log(error);
  } finally {
    loadingTable.value = false;
    confirmDeleteVisible.value = false;
    recordToDelete.value = null;
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
      const list = res.data.listCongSuat;
      formAdd.value.congSuat = list.map(item => item.groupValue).join('-');
      formAdd.value.giaCongSuat = list.map(item => item.giaTien).join('-');
    }

    if (res.data.listDynamic.length > 0) {
      const list = res.data.listDynamic;

      listDynamic.value.push({
        tenPhanLoai: list[0].tenPhanLoai,
        groupValue: list.map((item) => item.groupValue).join("-"),
      });
    }
    if (res.data.sanPham.linkAnhChinh!=null && res.data.sanPham.linkAnhChinh) {
      listImgProduct.value.push(res.data.sanPham.linkAnhChinh);
    }
    // console.log("list anh",(Array.isArray(res.data.listAnh) && res.data.listAnh.length > 0))
    if (Array.isArray(res.data.listAnh) && res.data.listAnh.length > 0) {
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
  const dynamicList = value.valueDynamic?.split("-") || [];

  if (congSuatList.length !== giaCongSuatList.length) {
    return false;
  }

  return {
    listCongSuat: congSuatList.map((item, index) => {
      return {
        tenPhanLoai: value.tenCongSuat || "Công suất",
        groupValue: item.trim(),
        giaTien: giaCongSuatList[index].trim(),
      };
    }),
    listKichThuoc: kichThuocList.map((item) => {
      return {
        tenPhanLoai: value.tenKichThuoc || "Kích thước",
        groupValue: item.trim(),
      };
    }),
    listDynamic: dynamicList.map((item) => {
      return {
        tenPhanLoai: value.tenDynamic || "",
        groupValue: item.trim(),
      };
    }),
    listDynamic2: kichThuocList.map((item) => {
      return {
        tenPhanLoai: value.tenKichThuoc || "Kích thước",
        groupValue: item.trim(),
      };
    })
  };
};

const submit = async () => {
  try {
    await formRef.value.validate();
    loadingDrawer.value = true;

    const phanLoaiList = getListPhanLoai(formAdd.value);

    if (!phanLoaiList) {
      message.error("Công suất và giá tiến công suất phải tương ứng");
      return;
    }
    if (formAdd.value.id) {
      // console.log("product",(Array.isArray(listImgProduct.value) && listImgProduct.value.length > 0))
      // if (){
      const listAnhFilter =(Array.isArray(listImgProduct.value) && listImgProduct.value.length > 0)? listImgProduct.value.map((item) => {
        return {
          linkAnh: item,
        };
      }):null;
      const bodyRequest = {
        sanPham: {
          ...formAdd.value,
          giaSp: formAdd.value.giaSp,
          linkAnhChinh: (Array.isArray(listImgProduct.value) && listImgProduct.value.length > 0)?listAnhFilter[0].linkAnh:null,
        },
        listAnh:(Array.isArray(listImgProduct.value) && listImgProduct.value.length > 0)? listAnhFilter.slice(1):null,
        ...phanLoaiList,
      };
      await editProduct(bodyRequest);
      message.success("Sửa sản phẩm thành công");
      onClose();
      await fetch();
    } else {
      const listAnhFilter =(Array.isArray(listImgProduct.value) && listImgProduct.value.length > 0)? listImgProduct.value.map((item) => {
        return {
          linkAnh: item,
        };
      }):null;
      const bodyRequest = {
        sanPham: {
          ...formAdd.value,
          giaSp: formAdd.value.giaSp,
          linkAnhChinh:(Array.isArray(listImgProduct.value) && listImgProduct.value.length > 0)? listAnhFilter[0].linkAnh:null,
        },
        listAnh: (Array.isArray(listImgProduct.value) && listImgProduct.value.length > 0)?listAnhFilter.slice(1):null,
        ...phanLoaiList,
      };
      const response = await addProduct(bodyRequest);
      message.success("Thêm mới sản phẩm thành công");
      onClose();
      await fetch();
    }
  } catch (error) {
    console.log('Error :', error);
    message.error(error?.response?.data?.message || 'Có lỗi xảy ra, cháu óc liên hệ Chú Đức');
  }
  // finally {
  //   loadingDrawer.value = false;
  // }
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

const beforeUploadExcel: UploadProps["beforeUpload"] = (file) => {
  const enableFilesUpload = ["xlsx", "xls"];
  const fileName = file.name.replace(/^.*\./, "");
  const validFile = enableFilesUpload.includes(fileName);
  if (!validFile) {
    message.error(
      "File Excel không hợp lệ, các file hợp lệ là ['xlsx', 'xls'] "
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

const previewModalVisible = ref(false);
const excelPreviewData = ref([]);
const uploading = ref(false);
const tempExcelData = ref(null);

const previewColumns = [
  {
    title: 'Danh mục ID',
    dataIndex: 'danhMucSanPhamId',
    width: 100,
  },
  {
    title: 'Mã SP',
    dataIndex: 'maSp',
    width: 120,
  },
  {
    title: 'Thương hiệu',
    dataIndex: 'thuongHieu',
    width: 150,
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'tenSanPham',
    width: 200,
  },
  {
    title: 'Công suất',
    dataIndex: 'congSuat',
    width: 150,
  },
  {
    title: 'Giá tiền',
    dataIndex: 'giaTien',
    width: 150,
  },
  {
    title: 'Mô tả',
    dataIndex: 'moTa',
    width: 200,
  },
  {
    title: 'Thông số',
    dataIndex: 'thongSo',
    width: 200,
  },
];

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const handleExcelChange = async ({ file }: UploadChangeParam) => {
  try {
    if (file.status !== "uploading") {
      loadingTable.value = true;
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          // Kiểm tra dữ liệu có hợp lệ không
          if (!jsonData || jsonData.length < 2) {
            message.error('File Excel không có dữ liệu hoặc thiếu dòng tiêu đề');
            return;
          }

          // Skip header row and process data
          const rows = jsonData.slice(1);
          
          const products = rows.map((row, index) => {
            try {
              // Kiểm tra và chuyển đổi dữ liệu công suất và giá tiền
              const congSuatValue = row[4];
              const giaTienValue = row[5];
              
              // Đảm bảo congSuatValue và giaTienValue là string trước khi split
              const congSuatString = congSuatValue ? String(congSuatValue) : '';
              const giaTienString = giaTienValue ? String(giaTienValue) : '';
              
              const congSuatList = congSuatString ? congSuatString.split('-') : [];
              const giaTienList = giaTienString ? giaTienString.split('-') : [];
              
              const listCongSuat = congSuatList.map((congSuat, idx) => ({
                tenPhanLoai: "congSuat",
                groupValue: congSuat.trim(),
                giaTien: giaTienList[idx]?.trim() || "0"
              }));

              return {
                sanPham: {
                  id: "",
                  danhMucSanPhamId: row[0] || "",
                  tenSanPham: row[3] || "",
                  thongSo: row[7] || "",
                  maSp: row[1] || "",
                  thuongHieu: row[2] || "",
                  moTa: row[6] || ""
                },
                listCongSuat
              };
            } catch (rowError) {
              console.error(`Lỗi xử lý dòng ${index + 2}:`, rowError);
              message.error(`Lỗi xử lý dòng ${index + 2} trong file Excel`);
              return null;
            }
          }).filter(Boolean); // Loại bỏ các dòng lỗi

          if (products.length === 0) {
            message.error('Không có dữ liệu hợp lệ trong file Excel');
            return;
          }

          // Store processed data for later use
          tempExcelData.value = products;

          // Prepare preview data
          excelPreviewData.value = rows.map(row => ({
            danhMucSanPhamId: row[0] || "",
            maSp: row[1] || "",
            thuongHieu: row[2] || "",
            tenSanPham: row[3] || "",
            congSuat: row[4] ? String(row[4]) : "",
            giaTien: row[5] ? String(row[5]) : "",
            moTa: row[6] || "",
            thongSo: row[7] || ""
          }));

          // Show preview modal
          previewModalVisible.value = true;
          message.success(`Đã xử lý thành công ${products.length} sản phẩm từ file Excel`);
        } catch (error) {
          console.error('Error processing Excel:', error);
          message.error('Có lỗi xảy ra khi xử lý file Excel. Vui lòng kiểm tra định dạng file.');
        }
      };
      reader.readAsArrayBuffer(file.originFileObj);
    }
  } catch (error) {
    console.error('Error uploading Excel:', error);
    message.error('Có lỗi xảy ra khi tải lên file Excel');
  } finally {
    loadingTable.value = false;
  }
};

const confirmUpload = async () => {
  if (!tempExcelData.value) return;

  try {
    uploading.value = true;
    const user = getCurrentUser();
    if (!user || !user.token) {
      message.error('Vui lòng đăng nhập để thực hiện chức năng này');
      return;
    }

    await axiosInstance.post('https://thegioiden.store/api/them-moi-list-sp', tempExcelData.value);

    message.success('Import sản phẩm thành công');
    previewModalVisible.value = false;
    await fetch();
  } catch (error) {
    console.error('Error uploading data:', error);
    if (error.response?.status === 401) {
      message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      router.push('/login');
    } else {
      message.error('Có lỗi xảy ra khi upload dữ liệu');
    }
  } finally {
    uploading.value = false;
  }
};

onMounted(async () => {
  await fetch();

  setTimeout(() => {
    categoryList.value = headerRef.value.getCategoryList();
  }, 100);
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

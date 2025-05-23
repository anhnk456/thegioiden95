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
import axios from 'axios';
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
  congSuat: "",
  giaCongSuat: "",
  kichThuoc: "",
  thongSo: "",
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

          // Skip header row and process data
          const rows = jsonData.slice(1);
          
          const products = rows.map(row => {
            const congSuatList = row[4]?.split('-') || [];
            const giaTienList = row[5]?.split('-') || [];
            
            const listCongSuat = congSuatList.map((congSuat, index) => ({
              tenPhanLoai: "congSuat",
              groupValue: congSuat.trim(),
              giaTien: giaTienList[index]?.trim() || "0"
            }));

            return {
              sanPham: {
                id: "",
                danhMucSanPhamId: row[0],
                tenSanPham: row[3],
                thongSo: row[7] || "",
                maSp: row[1],
                thuongHieu: row[2],
                moTa: row[6]
              },
              listCongSuat
            };
          });

          // Store processed data for later use
          tempExcelData.value = products;

          // Prepare preview data
          excelPreviewData.value = rows.map(row => ({
            danhMucSanPhamId: row[0],
            maSp: row[1],
            thuongHieu: row[2],
            tenSanPham: row[3],
            congSuat: row[4],
            giaTien: row[5],
            moTa: row[6],
            thongSo: row[7] || ""
          }));

          // Show preview modal
          previewModalVisible.value = true;
        } catch (error) {
          console.error('Error processing Excel:', error);
          message.error('Có lỗi xảy ra khi xử lý file Excel');
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

    await axios.post('http://localhost:8080/them-moi-list-sp', tempExcelData.value, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    message.success('Import sản phẩm thành công');
    previewModalVisible.value = false;
    await fetch();
  } catch (error) {
    console.error('Error uploading data:', error);
    if (error.response?.status === 401) {
      message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
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

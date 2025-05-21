<template>
  <div>
    <Header />
    <div class="wrapper-table">
      <div style="margin-bottom: 2rem; float: right">
        <a-button @click="onOpen" type="primary">Thêm danh mục</a-button>
      </div>
      <a-form
        ref="formRef"
        :model="formSearch"
        style="margin-top: 4rem"
        :wrapper-col="{ span: 8 }"
      >
        <a-form-item label="Tên danh mục" name="tenDanhMuc">
          <a-input
            v-model:value="formSearch.tenDanhMuc"
            @change="handleFilterSearch"
          />
        </a-form-item>
      </a-form>
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        :loading="loadingTable"
        size="small"
        bordered
      >
        <template #bodyCell="{ column, index, record }">
          <template v-if="column.dataIndex === 'stt'">
            <span>{{ index + 1 }}</span>
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
            label="Tên danh mục cha"
            name="idThuMuc"
            :rules="[{ required: true, message: 'Vui lòng nhập tên danh mục' }]"
          >
            <a-select v-model:value="formAdd.idThuMuc">
              <a-select-option
                v-for="(item, index) in optionsThuMuc"
                :key="index"
                :value="item.id"
              >
                {{ item.tenThuMuc }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="Tên danh mục"
            name="tenDanhMuc"
            :rules="[{ required: true, message: 'Vui lòng nhập tên danh mục' }]"
          >
            <a-input v-model:value="formAdd.tenDanhMuc" />
          </a-form-item>
          <a-form-item label="Ảnh danh mục" name="anhDanhMuc">
            <a-upload
              :show-upload-list="false"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                Upload ảnh danh mục
              </a-button>
            </a-upload>
            <a-button @click="deteleImg" style="margin-left: 2rem" danger>
              Xóa ảnh này
            </a-button>
            <div v-if="previewUrl" style="margin-top: 2rem">
              <img :src="previewUrl" alt="Ảnh danh mục" style="max-width: 200px;" />
            </div>
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
import { message } from "ant-design-vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { Upload, UploadChangeParam, UploadProps } from "ant-design-vue";

import Header from "@/components/header.vue";
import {
  getAllDanhMuc,
  getAllThuMuc,
  addCategory,
  deleteCategory,
  editCategory,
} from "@/api/den-led";
import { storage } from "@/firebase";
import {
  ref as refFireBase,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const formRef = ref();
const dataSource = ref([]);
const allDataSouce = ref([]);
const optionsThuMuc = ref([]);
const open = ref(false);
const loadingTable = ref(false);
const loadingDrawer = ref(false);
const previewUrl = ref('');

const title = computed(() => {
  return formAdd.id ? "Sửa sản phẩm" : "Thêm sản phẩm";
});

const formAdd = reactive({
  id: "",
  tenDanhMuc: "",
  idThuMuc: "",
  anhDanhMuc: "",
});
const formSearch = reactive({
  tenDanhMuc: "",
});

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    width: 50,
  },
  {
    title: "Tên danh mục",
    dataIndex: "tenDanhMuc",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
    width: 120,
  },
];

const fetch = async () => {
  try {
    loadingTable.value = true;
    const res = await getAllDanhMuc();
    dataSource.value = res.data;
    allDataSouce.value = res.data;
  } catch (error) {
    console.log(error);
  } finally {
    loadingTable.value = false;
  }
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
      const storageRef = refFireBase(storage, `category-images/${file.name}`);
      await uploadBytes(storageRef, file.originFileObj);
      const url = await getDownloadURL(storageRef);
      previewUrl.value = url;
      formAdd.anhDanhMuc = url;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadingDrawer.value = false;
  }
};

const deteleImg = () => {
  previewUrl.value = '';
  formAdd.anhDanhMuc = '';
};

const onOpen = () => {
  open.value = true;
  formAdd.tenDanhMuc = "";
  formAdd.id = "";
  formAdd.idThuMuc = "";
  formAdd.anhDanhMuc = "";
  previewUrl.value = '';
};
const onClose = () => {
  open.value = false;
};
const onDelete = async (record) => {
  try {
    loadingTable.value = true;
    await deleteCategory(record.id);
    message.success("Xóa danh mục thành công");
    await fetch();
  } catch (error) {
    console.log(error);
  } finally {
    loadingTable.value = false;
  }
};
const onEdit = (record) => {
  open.value = true;
  formAdd.tenDanhMuc = record.tenDanhMuc;
  formAdd.idThuMuc = record.idThuMuc;
  formAdd.id = record.id;
  formAdd.anhDanhMuc = record.anhDanhMuc;
  previewUrl.value = record.anhDanhMuc;
};

const submit = async () => {
  try {
    await formRef.value.validate();
    loadingDrawer.value = true;
    if (formAdd.id) {
      const bodyRequest = {
        id: formAdd.id,
        tenDanhMuc: formAdd.tenDanhMuc,
        anhDanhMuc: formAdd.anhDanhMuc,
        idThuMuc: formAdd.idThuMuc,
      };
      await editCategory(bodyRequest);
      message.success("Sửa danh mục thành công");
    } else {
      const bodyRequest = {
        tenDanhMuc: formAdd.tenDanhMuc,
        anhDanhMuc: formAdd.anhDanhMuc,
      };
      await addCategory(bodyRequest);
      message.success("Thêm mới danh mục thành công");
    }
    onClose();
    await fetch();
  } catch (error) {
    console.log(error);
  } finally {
    loadingDrawer.value = false;
  }
};

const handleFilterSearch = () => {
  if (!formSearch.tenDanhMuc) {
    dataSource.value = allDataSouce.value;
  } else {
    dataSource.value = allDataSouce.value.filter((item) =>
      item.tenDanhMuc.includes(formSearch.tenDanhMuc)
    );
  }
};

onMounted(async () => {
  await fetch();
  const res = await getAllThuMuc();
  optionsThuMuc.value = res.data;
});
</script>

<style scoped>
.wrapper-table {
  padding: 60px;
}
</style>

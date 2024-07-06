<template>
  <div>
    <Header />
    <div
      style="
        margin-bottom: 2rem;
        float: right;
        margin-top: 2rem;
        padding-right: 60px;
      "
    >
      <a-button @click="onOpen" type="primary">Thêm ảnh banner</a-button>
    </div>
    <div class="wrapper-table">
      <a-table
        style="margin-top: 1rem"
        :dataSource="dataSource"
        :columns="columns"
        :loading="loadingTable"
        size="small"
        bordered
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'stt'">
            <span>{{ index + 1 }}</span>
          </template>
          <template v-if="column.dataIndex === 'detailImg'">
            <a-image :width="200" :src="record.anhBanner" />
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a-button @click="onDelete(record)" size="small" danger
                >Xóa</a-button
              >
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
    <a-drawer
      title="Thêm ảnh banner"
      size="large"
      :open="open"
      @close="onClose"
    >
      <a-spin :spinning="loadingDrawer">
        <a-form
          ref="formRef"
          style="margin-top: 4rem"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item label="Ảnh sản phẩm" name="anhSanPham">
            <a-upload
              :show-upload-list="false"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <a-button :disabled="listImgProduct.length > 0">
                <upload-outlined></upload-outlined>
                Upload ảnh sản phẩm
              </a-button>
            </a-upload>
            <a-button @click="deteleImg" style="margin-left: 2rem" danger>
              Xóa ảnh này
            </a-button>
            <a-carousel style="margin-top: 2rem">
              <div v-for="(item, index) in listImgProduct" :key="index">
                <img class="img-carousel" :src="item" alt="" />
              </div>
            </a-carousel>
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
import { onMounted, ref } from "vue";
import {
  Upload,
  UploadChangeParam,
  UploadProps,
  message,
} from "ant-design-vue";
import { UploadOutlined } from "@ant-design/icons-vue";

import Header from "@/components/header.vue";
import { getAllBanner, addBanner, deleteBanner } from "@/api/den-led";
import { storage } from "@/firebase";
import {
  ref as refFireBase,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const open = ref(false);
const loadingTable = ref(false);
const loadingDrawer = ref(false);

const dataSource = ref([]);
const listImgProduct = ref([]);

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    width: 50,
  },
  {
    title: "Chi tiết ảnh",
    dataIndex: "detailImg",
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

    const res = await getAllBanner();
    dataSource.value = res.data;
  } catch (error) {
    console.log(error);
  } finally {
    loadingTable.value = false;
  }
};

const onOpen = () => {
  open.value = true;

  listImgProduct.value = [];
};

const onClose = () => {
  open.value = false;
};

const onDelete = async (record) => {
  try {
    loadingTable.value = true;
    await deleteBanner(record.id);
    message.success("Xóa ảnh Banner thành công");
    await fetch();
  } catch (error) {
    console.log(error);
  } finally {
    loadingTable.value = false;
  }
};

const submit = async () => {
  try {
    loadingDrawer.value = true;

    await addBanner(listImgProduct.value);
    message.success("Thêm mới ảnh Banner thành công");
    onClose();
    await fetch();
  } catch (error) {
    console.log(error);
  } finally {
    loadingDrawer.value = false;
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

const deteleImg = () => {
  listImgProduct.value = [];
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

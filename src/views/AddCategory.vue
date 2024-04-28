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
            label="Tên danh mục"
            name="tenDanhMuc"
            :rules="[{ required: true, message: 'Vui lòng nhập tên danh mục' }]"
          >
            <a-input v-model:value="formAdd.tenDanhMuc" />
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

import Header from "@/components/header.vue";
import {
  getAllDanhMuc,
  addCategory,
  deleteCategory,
  editCategory,
} from "@/api/den-led";

const formRef = ref();
const dataSource = ref([]);
const allDataSouce = ref([]);
const open = ref(false);
const loadingTable = ref(false);
const loadingDrawer = ref(false);

const title = computed(() => {
  return formAdd.id ? "Sửa danh mục" : "Thêm danh mục";
});

const formAdd = reactive({
  id: "",
  tenDanhMuc: "",
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

const onOpen = () => {
  open.value = true;
  formAdd.tenDanhMuc = "";
  formAdd.id = "";
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
  formAdd.id = record.id;
};

const submit = async () => {
  try {
    await formRef.value.validate();
    loadingDrawer.value = true;
    if (formAdd.id) {
      const bodyRequest = {
        id: formAdd.id,
        tenDanhMuc: formAdd.tenDanhMuc,
        anhDanhMuc: "String",
      };
      await editCategory(bodyRequest);
      message.success("Sửa danh mục thành công");
    } else {
      const bodyRequest = {
        tenDanhMuc: formAdd.tenDanhMuc,
        anhDanhMuc: "String",
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
});
</script>

<style scoped>
.wrapper-table {
  padding: 60px;
}
</style>

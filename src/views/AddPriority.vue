<template>
  <div>
    <Header />
    <div class="wrapper-table">
      <a-form ref="formRef" :model="formSearch" style="margin-top: 4rem">
        <a-row :gutter="20" span="24">
          <a-col span="6"
            ><a-form-item label="Loại" name="loai">
              <a-select
                v-model:value="formSearch.loai"
                @change="handleChangeType"
              >
                <a-select-option
                  v-for="(item, index) in optionType"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-if="formSearch.loai == 4" span="6"
            ><a-form-item label="Tên Danh Mục" name="tenDanhMuc">
              <a-select
                v-model:value="formSearch.tenDanhMuc"
                @change="handleChangeDanhMuc"
              >
                <a-select-option
                  v-for="(item, index) in optionsDanhMuc"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.tenDanhMuc }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="6">
            <a-form-item label="Tên" name="ten">
              <a-input
                v-model:value="formSearch.ten"
                @change="handleFilterSearch"
              /> </a-form-item
          ></a-col>
        </a-row>
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
            <a-button @click="onEdit(record)" size="small">Sửa</a-button>
          </template>
        </template>
      </a-table>
    </div>
    <a-drawer
      title="Thay đổi mức độ ưu tiên"
      size="large"
      :open="open"
      @close="onClose"
    >
      <a-spin :spinning="loadingDrawer">
        <a-form
          ref="formRef"
          :model="formAdd"
          style="margin-top: 4rem"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item label="Tên" name="ten">
            <a-input v-model:value="formAdd.ten" />
          </a-form-item>
          <a-form-item
            label="Mức độ ưu tiên"
            name="mucDoUuTien"
            :rules="[{ required: true, message: 'Vui lòng nhập tên danh mục' }]"
          >
            <a-input v-model:value="formAdd.mucDoUuTien" />
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
import { onMounted, reactive, ref } from "vue";
import { message } from "ant-design-vue";

import Header from "@/components/header.vue";
import {
  getAllDanhMuc,
  getAllThuMuc,
  getAllTongMuc,
  getSpByDm,
  uuTienTongMuc,
  uuTienThuMuc,
  uuTienDanhMuc,
  uuTienSanPham,
} from "@/api/den-led";

const optionType = [
  {
    value: 1,
    label: "Tổng mục",
  },
  {
    value: 2,
    label: "Danh mục cha",
  },
  {
    value: 3,
    label: "Danh mục",
  },
  {
    value: 4,
    label: "Sản phẩm",
  },
];
const renderKeys = {
  1: "tenTongMuc",
  2: "tenThuMuc",
  3: "tenDanhMuc",
  4: "tenSanPham",
};

const formRef = ref();
const dataSource = ref([]);
const allDataSouce = ref([]);
const optionsDanhMuc = ref([]);
const open = ref(false);
const loadingTable = ref(false);
const loadingDrawer = ref(false);
const formAdd = ref({
  id: "",
  ten: "",
  mucDoUuTien: "",
});

const formSearch = reactive({
  loai: null,
  ten: "",
  tenDanhMuc: "",
});

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    width: 50,
  },
  {
    title: "Tên",
    dataIndex: "ten",
    customRender: ({ record }) => {
      return record[renderKeys[formSearch.loai]] || "";
    },
  },
  {
    title: "Mức độ ưu tiên",
    dataIndex: "mucDoUuTien",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
    width: 80,
  },
];

const updateDataSource = (data: any) => {
  dataSource.value = data;
  allDataSouce.value = data;
};

const fetch = async (api: Function) => {
  loadingTable.value = true;
  try {
    const res = await api();
    updateDataSource(res.data);
  } catch (error) {
    console.log(error);
  } finally {
    loadingTable.value = false;
  }
};

const onClose = () => {
  open.value = false;
};

const onEdit = (record) => {
  open.value = true;
  formAdd.value = { ...record };
  formAdd.value.ten = record[renderKeys[formSearch.loai]];
};

const submit = async () => {
  await formRef.value.validate();
  try {
    loadingDrawer.value = true;

    const actions = {
      1: uuTienTongMuc,
      2: uuTienThuMuc,
      3: uuTienDanhMuc,
      4: uuTienSanPham,
    };

    const action = actions[formSearch.loai];
    await action([formAdd.value]);
    message.success("Thay đổi Mức độ ưu tiên thành công");
    if (formSearch.loai == 4) {
      handleChangeDanhMuc(formSearch.tenDanhMuc);
    } else {
      handleChangeType(formSearch.loai);
    }
    onClose();
  } catch (error) {
    console.log(error);
  } finally {
    loadingDrawer.value = false;
  }
};

const handleFilterSearch = () => {
  if (!allDataSouce.value.length) return;

  if (!formSearch.ten) {
    dataSource.value = allDataSouce.value;
    return;
  }

  const key = renderKeys[formSearch.loai];
  if (key) {
    const searchTerm = formSearch.ten.toLowerCase();
    dataSource.value = allDataSouce.value.filter((item) =>
      item[key].toLowerCase().includes(searchTerm)
    );
  }
};

const handleChangeType = (value: number) => {
  const fetchFunctions: { [key: number]: () => void } = {
    1: () => fetch(getAllTongMuc),
    2: () => fetch(getAllThuMuc),
    3: () => fetch(getAllDanhMuc),
    4: () => {
      // Không làm gì cho trường hợp này
    },
  };

  const fetchFunction = fetchFunctions[value];

  if (fetchFunction) {
    fetchFunction();
  } else {
    // Xử lý các giá trị không mong đợi
    console.warn(`Unexpected value: ${value}`);
  }
};

const handleChangeDanhMuc = async (value: any) => {
  if (!value) return;

  loadingTable.value = true;
  try {
    const params = {
      idDanhMuc: value,
      page: 0,
      size: 9999,
    };
    const res = await getSpByDm(params);
    updateDataSource(res.data);
  } catch (error) {
    console.log(error);
  } finally {
    loadingTable.value = false;
  }
};
onMounted(async () => {
  try {
    const res = await getAllDanhMuc();
    optionsDanhMuc.value = res.data;
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped>
.wrapper-table {
  padding: 60px;
}
</style>

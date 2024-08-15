<template>
  <a-breadcrumb style="background-color: #e5e5e5">
    <a-breadcrumb-item style="padding-left: 60px"
      ><a href="/">Trang chủ</a></a-breadcrumb-item
    >
    <a-breadcrumb-item v-for="item in listData"></a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts">
const props = defineProps({
  listData: Array,
});
</script>

<style scoped></style>

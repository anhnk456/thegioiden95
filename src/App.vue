<script setup>
import { RouterView } from "vue-router";
import CartDrawer from '@/components/CartDrawer.vue';
import { useCartStore } from '@/store/cart';
import { onMounted } from 'vue';

const cartStore = useCartStore();

onMounted(() => {
  cartStore.initializeCart();
});
</script>

<template>
  <RouterView />
  <CartDrawer />
</template>

<style scoped></style>

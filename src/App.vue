<template>
  <SplashScreen v-if="loading" />
  <RouterView v-else />
</template>
<style lang="scss">
@import '@/index.scss';
</style>
<script lang="ts" setup>
import SplashScreen from '@/modules/splash.vue';
import { ref, onMounted } from 'vue';

const loading = ref(true);

onMounted(() => {
  loading.value = false;
  document.body.style.height = window.innerHeight + 'px';
  window.addEventListener('resize', (e) => {
    document.body.style.height = window.innerHeight + 'px';
  });
});
</script>

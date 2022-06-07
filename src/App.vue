<template>
  <div id="app">
    <SplashScreen v-if="loading" />

    <RouterView v-else />
  </div>
</template>
<style lang="scss">
@import '@/index.scss';
</style>
<script lang="ts" setup>
import SplashScreen from '@/modules/splash.vue';
import { ref, onMounted } from 'vue-demi';

const loading = ref(true);

onMounted(() => {
  document.addEventListener('readystatechange', (e) => {
    if (document.readyState == 'complete') {
      // run code here
      loading.value = false;
    }
  });
});
</script>

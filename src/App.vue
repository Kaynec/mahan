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
  document.body.style.height = window.innerHeight + 'px';

  document.addEventListener('readystatechange', (e) => {
    if (document.readyState == 'complete') {
      // run code here
      loading.value = false;
    }
  });
  window.addEventListener('resize', (e) => {
    document.body.style.height = window.innerHeight + 'px';
  });
});
</script>

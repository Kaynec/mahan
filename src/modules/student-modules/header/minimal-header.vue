<template>
  <nav
    :class="`${isMobile.value ? 'minimal-nav' : 'minimal-nav pc'} ${
      colors ? 'dark' : ''
    } `"
  >
    <span> {{ title }} </span>
    <i class="fas fa-arrow-left" @click="goOnePageBack()"></i>
  </nav>
</template>
<script lang="ts" setup>
import router from '@/router';
import { RouteRecordName } from 'vue-router';

const { colors = false, onePageBack } = defineProps<{
  title?: string;
  onePageBack?: string;
  colors?: boolean;
}>();

const goOnePageBack = () => {
  if (onePageBack) {
    router.push({
      name: onePageBack as unknown as RouteRecordName
    });
  } else {
    router.go(-1);
  }
};
</script>

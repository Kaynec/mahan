<template>
  <div class="remove">{{ label || 'حذف از حساب کاربری' }}</div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<style scoped lang="scss">
@import '@/css-variable/Global.scss';

.remove {
  background: $dark;
  color: white;
  border-radius: 7px;
  margin-top: 10px;
  padding: 0.5rem;
  text-align: center;
  width: 12rem;
  font-size: 12px;

  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

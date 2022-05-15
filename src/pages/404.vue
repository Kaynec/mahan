<template>
  <main class="404">
    <h1 class="center">صفحه مورد نظر پیدا نشد</h1>
    <div class="btns">
      <button class="button-linear" @click="onePageBack">
        برگشت به صفحه قبلی
      </button>
      <button class="button-linear" @click="goStudentHome">
        رفتن به صفحه دانشجو
      </button>
      <button class="button-linear" @click="goMentorHome">
        رفتن به صفحه مشاور
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import router from '@/router';

const goStudentHome = () => {
  router.push({
    name: 'Home'
  });
};

const goMentorHome = () => {
  router.push({
    name: 'MentorProfile'
  });
};

const onePageBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.center {
  margin-top: 25vh;
}

.btns {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 5rem;
}

.button-linear {
  color: #fff;
  max-width: 300px;
  margin: 0.1rem 0;
  transition: all 0.3s ease-in-out;
}

.button-linear:hover {
  cursor: pointer;
  transform: translate(-10%);
}
</style>

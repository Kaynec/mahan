<template>
  <div class="overlay">
    <div class="Card">
      <button
        class="cancel"
        @click="
          $router.push({
            name: 'Home'
          })
        "
      >
        X
      </button>
      <span class="header"> اختتامیه آزمون خودسنجی </span>

      <span> شما این فصل را با موفقیت سپری کردید </span>

      <button
        class="confirm"
        @click="
          $router.push({
            name: 'SelfTestReportCard',
            params: { data: JSON.stringify(session) }
          })
        "
      >
        مشاهده کارنامه
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  session: {
    required: true
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable/Global.scss';
.overlay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.279);
  z-index: 999999;

  .Card {
    border-radius: 15px;
    display: flex;
    padding: 2rem;
    flex-direction: column;
    background-color: white;
    position: relative;
    gap: 1rem;

    text-align: center;

    button {
      border: none;
    }

    .header {
      font-weight: 700;
      font-size: 1rem;
    }

    .confirm {
      background-color: red;
      color: white;
      text-align: center;
      border-radius: 15px;
      padding: 1rem 0;
    }
    .cancel {
      position: absolute;
      top: -15%;
      right: -3%;
      border: none;
      border-radius: 1rem;
      width: 3rem;
      height: 3rem;
      aspect-ratio: 1;
      background: $dark;
      color: white;
      font-size: large;
    }
  }
}
</style>

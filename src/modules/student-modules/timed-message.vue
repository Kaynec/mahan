<template>
  <div class="overlay">
    <div class="Card">
      <button class="cancel" @click="$emit('cancel')">X</button>
      <span class="header"> {{ msg }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  msg: {
    required: true,
    type: String
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
    padding: 3rem;
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

    .cancel {
      position: absolute;
      top: -15%;
      right: -3%;
      border: none;
      border-radius: 1rem;
      width: 3rem;
      height: 3rem;
      aspect-ratio: 1;
      background: #2aa296;
      color: white;
      font-size: large;
    }
  }
}
</style>

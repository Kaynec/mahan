<template>
  <div class="overlay">
    <div class="Card">
      <button class="cancel" @click="$emit('cancel')">X</button>
      <span class="header"> عدد مورد نظر خود را وارد نمایید</span>

      <input
        type="number"
        max="3"
        v-model="countDownNumber"
        class="count-down-input"
      />

      <button class="confirm" @click="submitCountDown">ثبت کانت داون</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import alertify from '@/assets/alertifyjs/alertify';
import { ref } from 'vue';
import { StudentMessageApi } from '@/api/services/student/student-message-service';

const emit = defineEmits(['cancel', 'success']);

const countDownNumber = ref('');

const todayInText = new Date().toLocaleDateString('fa-Fa', {
  dateStyle: 'full'
});

const submitCountDown = async () => {
  if (!countDownNumber.value) alertify.error('لطفا عدد را وارد نمایید');

  try {
    const countDownObject = {
      title: todayInText,
      description: todayInText,
      countNumber: countDownNumber.value
    };

    const res = await StudentMessageApi.adddCountDown(countDownObject);

    if (res.data?.data) {
      console.log(res.data.data);
      emit('success');
    }
  } catch (error) {
    console.log(error);
    emit('cancel');
  }

  // Submit
};
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

  .count-down-input {
    background-color: #ededed;
    color: red;
    font-size: larger;
    font-weight: 600;
    border-radius: 10px;
    padding: 0.5rem;
    border: none;
    text-align: center;
  }
}
</style>

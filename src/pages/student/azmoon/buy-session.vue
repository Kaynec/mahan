<template>
  <div class="overlay">
    <ShowAllSessions
      v-if="ShowAllSession"
      :allSessions="allSessions"
      @cancel="$emit('cancel')"
    />
    <div class="Card" v-else>
      <button class="cancel" @click="$emit('cancel')">X</button>
      <span class="header">
        برای شرکت دراین آزمون ابتدا باید سرفصل را خریداری کنید.
      </span>

      <div class="price">
        <span>قیمت:</span>
        <span>{{ data.price }}</span>
      </div>

      <div class="btns">
        <button class="change" @click="ShowAllSession = true">
          مشاهده همه سرفصل ها
        </button>
        <button
          class="confirm"
          v-if="!data.exists"
          @click="
            addSessionToBasket(data).then((res) => {
              data.exists = true;
            })
          "
        >
          افزودن به سبد خرید
        </button>

        <button
          class="change"
          v-else
          @click="
            addSessionToBasket(data).then((res) => {
              data.exists = false;
            })
          "
        >
          حذف
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addSessionToBasket, getBasketInfo } from '@/api/basket-functions';
import { ref } from 'vue';
import ShowAllSessions from './show-all-sessions.vue';

import { onBeforeMount } from 'vue';

const { data } = defineProps<{
  data: { [index: string]: any };
  allSessions: { [index: string]: any };
}>();

const ShowAllSession = ref(false);

onBeforeMount(async () => {
  const res = await getBasketInfo();
  if (res.data.sessions.find((el) => el.session._id === data._id)) {
    data.exists = true;
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
    padding: 2rem 0;
    flex-direction: column;
    background-color: white;
    position: relative;
    gap: 1rem;
    width: 90%;
    max-width: 450px;

    text-align: center;

    button {
      border: none;
    }

    .btns {
      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 0.8rem;

      button {
        flex-basis: 50%;
        padding: 1rem 0;
      }

      .change {
        background-color: transparent;

        border: 1px solid red;
        color: red;
      }
    }

    .header {
      font-weight: 700;
      font-size: 1.5rem;
      color: #585959;
    }

    .price {
      display: flex;
      justify-content: space-between;
      padding: 2rem 1rem 0 1rem;
      color: #828282;
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
      top: 0;
      right: 0;
      margin: -1rem;
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

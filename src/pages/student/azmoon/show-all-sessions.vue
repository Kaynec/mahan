<template>
  <div class="Card">
    <button class="cancel" @click="$emit('cancel')">X</button>

    <section v-dragscroll>
      <div class="item" v-for="session in allSessions">
        <div>
          <span class="header"> {{ session.title }} </span>
          <span class="price"> قیمت : {{ session.price }} تومان </span>
        </div>
        <div>
          <button
            class="remove"
            @click="addSessionToBasket(session)"
            v-if="session.exists"
          >
            حذف از سبد خرید
          </button>
          <button v-else @click="addSessionToBasket(session)">
            افزودن به سبد خرید
          </button>
        </div>
      </div>
    </section>
    <!--  -->
    <div class="footer">
      <div>
        <!-- Fix THis Later With The Real Count of The User -->
        <img
          src="../../../assets/img/shop/noun-cart-1844738.png"
          alt="shop cart icon"
        />
        {{ store.getters.getBasketCount }} محصول
      </div>
      <span
        style="cursor: pointer"
        @click="$router.push({ name: 'ShopBasket' })"
        >مشاهده سبد خرید</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from '@/store';
import { ref, onBeforeMount } from 'vue';
import { dragscroll as vDragscroll } from 'vue-dragscroll';
import {
  updateCount,
  addSessionToBasket,
  itemExistsInBasket
} from '@/api/basket-functions';

const { allSessions: allSessionsProps } = defineProps<{
  allSessions: any[];
}>();

const allSessions = ref(allSessionsProps);

onBeforeMount(async () => {
  allSessions.value = await itemExistsInBasket(allSessions.value, 'session');

  allSessions.value = allSessions.value.filter((el) => el.bought === false);

  console.log(allSessions.value);

  //
  updateCount();
});
</script>

<style lang="scss" scoped>
@import '@/css-variable/Global.scss';

.Card {
  display: flex;
  padding: 2rem;
  flex-direction: column;
  position: relative;
  gap: 1rem;
  width: 90%;
  max-width: 450px;

  overflow-y: visible;

  text-align: center;

  button {
    border: none;
  }

  section {
    overflow-y: auto;
    padding-bottom: 2rem;
    height: 70vh;
    max-height: 800px;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem;
    div {
      &:first-child {
        flex-direction: column;

        display: flex;
        align-items: start;
      }
    }

    // Button
    button {
      padding: 0.6rem 0.25rem;
      background-color: red;
      color: white;
      text-align: center;
      border-radius: 10px;
      font-size: 0.65rem;
    }

    .remove {
      background: $dark;
    }

    //
    .header {
      font-weight: 700;
      font-size: 0.9rem;
      color: #585959;
    }

    .price {
      display: flex;
      font-size: 0.7rem;

      justify-content: space-between;
      padding: 2rem 0 0 1rem;
      color: #828282;
    }
  }
  .cancel {
    position: absolute;
    top: -0.8rem;
    right: -0.8rem;
    overflow: visible;
    border: none;
    border-radius: 1rem;
    width: 3rem;
    height: 3rem;
    aspect-ratio: 1;
    background: #2aa296;
    color: white;
    font-size: large;
  }
  //
  .footer {
    width: 100%;
    background: #2aa296;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    position: absolute;
    bottom: 0;
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;

    div {
      font-family: IRANSans;
      font-size: 14px;
      text-align: right;
      color: #fff;
    }

    span {
      font-family: IRANSans;
      font-size: 12px;
      text-align: center;
      color: #fff;
      border-radius: 18px;
      padding: 5px 10px;
      border: solid 1px #fff;
    }
  }

  //
}
</style>

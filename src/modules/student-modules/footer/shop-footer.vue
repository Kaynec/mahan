<template>
  <div class="footer" v-if="isMobile.value">
    <div>
      <!-- Fix THis Later With The Real Count of The User -->
      <img
        src="../../../assets/img/shop/noun-cart-1844738.png"
        alt="shop cart icon"
      />
      {{ store.getters.getBasketCount }} محصول
    </div>
    <span @click="moveToBasket">مشاهده سبد خرید</span>
  </div>
</template>

<script setup lang="ts">
import { store } from '@/store';
import router from '@/router';
// import { StudentBasketApi } from '@/api/services/student/student-basket-service';

// StudentBasketApi.get().then((res) => console.log(res))

const emit = defineEmits(['iHaveBeenTouched']);

const moveToBasket = () => {
  emit('iHaveBeenTouched');
  router.push({
    name: 'ShopBasket'
  });
};
</script>

<style lang="scss" scoped>
@import '@/css-variable/Global.scss';
.footer {
  width: 100%;
  background: #2b2d42;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  position: fixed;
  bottom: 0;

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
</style>

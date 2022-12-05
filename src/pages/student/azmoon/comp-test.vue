<template>
  <div class="comp-test" :style="`padding-top :${isMobile.value ? '' : '8vh'}`">
    <DesktopMinimalHeader v-if="!isMobile.value" />
    <Header />
    <MinimalHeader
      title="آزمون جامع"
      onePageBack="Home"
      v-if="isMobile.value"
    />
    <div class="hero animate__animated animate__fadeIn">
      <img
        :src="`${
          isMobile.value
            ? require('@/assets/img/comptest-min.png')
            : require('@/assets/img/comptest-pc.png')
        }`"
        :style="`margin-top  : ${isMobile.value ? '0' : '2rem'}`"
        alt="header of comp test"
      />
    </div>
    <div class="buttons animate__animated animate__fadeIn">
      <button
        @click="() => (currentState = 'future')"
        :class="{ active: currentState == 'future' }"
      >
        آزمون های جاری
      </button>
      <button
        @click="() => (currentState = 'past')"
        :class="{ active: currentState == 'past' }"
      >
        آزمون های گذشته
      </button>
    </div>

    <CompTestFuture v-if="currentState == 'future'" />
    <CompTestPast v-if="currentState == 'past'" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CompTestPast from '@/modules/student-modules/azmoon/comp-test-past.vue';
import CompTestFuture from '@/modules/student-modules/azmoon/comp-test-future.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import Header from '@/modules/student-modules/header/header.vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
const currentState = ref('past');
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.comp-test {
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  max-width: 1000px;

  // padding-top: 5vh;

  .hero {
    width: 90%;
    max-width: 1000px;
    padding-top: 2rem;
    max-height: 300px;
    margin: 15px auto 0 auto;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .buttons {
    margin: 1rem auto;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;

    button {
      font-family: IRANSans;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 15px;
      outline: none;
      border: none;
      width: 50%;
      box-shadow: 0 0 23px 0 rgba(0, 0, 0, 0.13);
      background: white;
      color: #171717;

      &:nth-child(2) {
        border-radius: 10px 0px 0px 10px;
      }
      &:nth-child(1) {
        border-radius: 0px 10px 10px 0px;
      }
    }
  }
  button.active {
    background-image: $blueish-background;
    color: #fff;
  }
}
</style>

<template>
  <div
    @touchstart="touchstart"
    @touchend="touchend"
    ref="Dialog"
    class="dialog"
    @mouseenter="mouseEnter()"
    @mouseleave="mouseLeave()"
    @click="click()"
  >
    <img
      v-if="active"
      src="../../assets/img/vpn-key-white.png"
      alt="vpn key white"
    />
    <img v-else src="../../assets/img/vpn-key-red.png" alt="vpn key red" />
    <span> {{ label }} </span>
    <i
      class="fas fa-angle-left position-absolute top-50 start-0 translate-middle ml-3"
    ></i>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router/index';

const {
  componentName = 'empty',
  params,
  label
} = defineProps<{
  label: string;
  componentName: string;
  params: string;
}>();

let Dialog = ref();
let active = ref(false);

const touchstart = () => {
  active.value = true;
  Dialog.value.classList.add('active');
};

const mouseEnter = () => {
  active.value = true;
  Dialog.value.classList.add('active');
};

const mouseLeave = () => {
  active.value = false;
  Dialog.value.classList.remove('active');
};

const touchend = () => {
  active.value = false;
  Dialog.value.classList.remove('active');

  if (componentName !== 'empty') {
    const tmp = {
      name: componentName
    };
    params &&
      (tmp.params = {
        id: params
      });
    router.push(tmp);
  }
};
const click = () => {
  if (!mobile) {
    if (componentName != 'empty') {
      const tmp = {
        name: componentName
      };
      params &&
        (tmp.params = {
          id: params
        });
      router.push(tmp);
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;
  width: 70%;
  width: 85%;
  height: 47px;
  margin: 5px 0 5px 0;
  padding: 0.6rem;
  border-radius: 8px;
  color: black;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  gap: 0.5rem;

  span {
    font-family: IRANSans;
    font-size: 13px;
    font-weight: bold;
    line-height: 3.82;
    color: #171717;
  }

  .fa-angle-left {
    color: black !important;
  }
  .label {
    font-family: IRANSans;
    font-size: 12px;
    font-weight: 500;
  }
  .text-detail {
    font-family: IRANSans;
    font-size: 10px;
  }
  .card-icon {
    color: #c73f44d3;
    margin: 8px 0 4px 11.4px;
    font-size: 1.4rem;
  }
}
.active {
  &:before {
    content: '';
    position: absolute;
    padding: 0.6rem;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #bd2b41;
    z-index: -2;
  }
  .fa-angle-left {
    color: white !important;
  }
  &:after {
    content: '';
    position: absolute;
    padding: 0.6rem;
    right: 0;
    width: 65%;
    height: 100%;
    border-radius: 8px;
    background: #9f2336;
    border-top-left-radius: 3em;
    z-index: -1;
  }
}
.active * {
  color: #fff !important;
}
</style>

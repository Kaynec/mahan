<template>
  <nav :class="`${isMobile.value ? 'nav' : 'nav pc'} ${colors ? 'dark' : ''} `">
    <span> {{ title }} </span>
    <i class="fas fa-arrow-left" @click="goOnePageBack()"></i>
  </nav>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';
import { RouteRecordName } from 'vue-router';

export default defineComponent({
  props: {
    title: { type: String, default: '' },
    onePageBack: { type: String },
    colors: { default: false }
  },
  setup(props) {
    const goOnePageBack = () => {
      if (props.onePageBack) {
        router.push({
          name: props.onePageBack as unknown as RouteRecordName
        });
      } else {
        router.go(-1);
      }
    };

    return { goOnePageBack };
  }
});
</script>
<style lang="scss" scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.09), 0 2px 4px 0 rgba(0, 0, 0, 0.19);
  color: white;
  position: sticky; /* Set the navbar to fixed position */
  z-index: 9999;
  background-color: white;
  top: 0;
  max-height: 10vh;
  font-family: IRANSans;
  padding: 0.3rem;

  color: #e51c21;

  i {
    font-size: 1rem;
  }

  img {
    padding: 0;
    margin: 0;
  }
  span {
    font-size: 9px;
    font-weight: bold;
    padding: 0.4rem;
  }
}

.pc {
  box-shadow: none;
  color: #000;
  background: transparent;
  max-width: 1000px;

  margin-top: 3.5em;
  top: 0;
  padding: 0 20px;

  span {
    font-size: 14px;
  }

  i {
    font-size: 25px !important;
  }
}

.dark {
  background: #000;
  color: #fff;
  padding: 1rem;
}
</style>

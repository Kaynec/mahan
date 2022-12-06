<template>
  <header class="big-header" v-if="mobile">
    <img alt="logo" src="@/assets/img/logo-mahan.png" />
    <div class="user-part">
      <span class="points">
        امتیاز شما:
        {{ toPersianNumbers(`${point}`) }}
      </span>

      <router-link to="/student/home" style="text-decoration: none">
        <div class="home">
          <i class="fa fa-home" aria-hidden="true"></i>
        </div>
      </router-link>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { store } from '@/store';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import MinimalHeader from './minimal-header.vue';

const currentUser = ref(store.getters.getCurrentStudent);

const point = ref('0');
if (currentUser.value && currentUser.value.point)
  point.value = currentUser.value.point;
</script>

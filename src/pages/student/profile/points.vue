<template>
  <!-- <div class="desktop" v-if="!mobile"></div> -->
  <div class="history">
    <DesktopMinimalHeader v-if="!mobile" />
    <Header />
    <MinimalHeader title="امتیازات" onePageBack="MyProfile" />
    <!--  -->
    <div class="container">
      <div class="container-header">
        <span> #</span>
        <span>امتیاز </span>
        <span>تاریخ</span>
      </div>
      <TableChild
        v-for="item in data"
        :key="item"
        :data="JSON.stringify(item)"
        typeOfComponent="point"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import TableChild from '@/modules/student-modules/table-child.vue';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import Header from '@/modules/student-modules/header/header.vue';

const data = ref([]);

StudentAuthServiceApi.getStudentPoints().then(
  (res) => (data.value = res.data?.data)
);
</script>

<style lang="scss" scoped>
.history {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f4f4f4;
  font-family: IRANSans;
  max-width: 1000px;

  // padding-top: 8vh;

  .container {
    width: 99%;
    margin: 1rem auto;

    .container-header {
      background-color: #ddd;
      width: 100%;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      padding-left: 2.5rem;
      span {
        font-size: 10px;
        font-weight: bold;
        color: #000;
      }
    }
    //
  }
}
</style>

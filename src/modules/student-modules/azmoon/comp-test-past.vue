<template>
  <div class="loader-parent" v-if="isLoading">
    <div class="loading1"></div>
  </div>
  <div class="container" v-else>
    <div
      class="card w-100 d-inline-flex align-items-center m-1 position-relative flex-row flex-wrap border border-white rounded-10 customDiv warning animate__animated animate__fadeIn"
      @click="moveToReportCardOrExam(item)"
      v-for="item in azmoonData"
      :key="item"
    >
      <div class="d-flex flex-column mt-1 p-0 m-0">
        <span class="label text-dark text-right mb-2 text-bold">
          <!-- {{ !item.passed ? 'تعداد آزمون' : 'رتبه شما' }} : {{ item.count }} -->
          {{ item.title }}
        </span>
        <span class="text-detail text-right">
          <i class="far fa-clock"></i>
          {{ item.date['weekDay'] }}
          {{ item.date['day'] }}
          {{ item.date['month'] }}

          <strong> | </strong>
          {{ `ساعت ${toPersianNumbers(item.time)}` }}
        </span>
      </div>
      <div class="img position-absolute top-50 start-0 ml-5 translate-middle">
        <img
          v-if="item.results && item.results.length"
          src="@/assets/img/accept-path-light.png"
          class="img"
          alt="active"
        />
      </div>
      <img
        src="@/assets/img/shape.svg"
        class="position-absolute top-50 start-0 translate-middle ml-3"
        alt="angle left icon"
      />
    </div>
    <!--  -->

    <CompTestDetail
      v-if="showCompDetail"
      :data="currentItem"
      @convertBoolean="changeShowDetail"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { StudentExamApi } from '@/api/services/student/student-exam-service';
import compareAsc from 'date-fns/compareAsc';
import CompTestDetail from '@/modules/student-modules/azmoon/comp-test-detail.vue';
import shamsi_be_miladi from '@/utilities/date-converter';
import { useStudentStore } from '@/store';
import alertify from '@/assets/alertifyjs/alertify';

const isLoading = ref(true);
const azmoonData = reactive([] as any);

StudentExamApi.getAll().then((res) => {
  res.data.data.forEach((date: any) => {
    const splitted = date.date.split('/');
    const jalalidateConvertedToMiladi = new Date(
      shamsi_be_miladi(+splitted[0], +splitted[1], +splitted[2]) as any
    );

    jalalidateConvertedToMiladi.setHours(
      +date.time.split(':')[0],
      +date.time.split(':')[1]
    );

    if (
      compareAsc(
        new Date(jalalidateConvertedToMiladi.getTime() + date.duration * 60000),
        new Date()
      ) <= 0
    )
      azmoonData.push(date);
  });

  azmoonData.forEach((child: any) => {
    let mDate = new Date(
      shamsi_be_miladi(
        +child.date.split('/')[0],
        +child.date.split('/')[1],
        +child.date.split('/')[2]
      ) as any
    );
    let currentDate = mDate.toLocaleDateString('fa-FA', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }) as any;
    currentDate = currentDate.split(',');

    let month = currentDate[0].split(' ')[0];
    let day = currentDate[0].split(' ')[1];
    let weekDay = currentDate[1];

    child.date = {
      ...child.date,
      weekDay,
      day,
      month
    };
  });

  isLoading.value = false;
});

const currentItem = ref({});
const showCompDetail = ref(false);
const changeShowDetail = () => {
  showCompDetail.value = !showCompDetail.value;
};

const moveToReportCardOrExam = (item) => {
  const isPurchased = (useStudentStore().getters.getCurrentStudent as any)
    ?.purchased;
  // if (!isPurchased) {
  //   alertify.error('لطفا نسخه برنامه را خریداری کنید');
  //   return;
  // }
  currentItem.value = item;
  showCompDetail.value = true;
};
</script>

<style lang="scss" scoped>
.container {
  width: 96%;
  height: 100%;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 3rem;
}
.card {
  border-radius: 10px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;
  font-family: IRANSans;
  cursor: pointer;
  .img {
    width: 27px;
    height: 27px;
    padding: 7px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #4ac367;

    img {
      object-fit: contain;
    }
  }

  .fa-angle-left {
    color: black !important;
  }
  .label {
    font-size: 13px;
    font-weight: bold;
  }
  .text-detail {
    margin: 0 5px 0 0;
    font-size: 11px;
    color: #313131;

    strong {
      margin-right: 0.4rem;
      margin-left: 0.75rem;
    }
  }
}
.customDiv {
  position: relative;
  z-index: 1;
  padding: 0.6rem;

  &:last-child {
    margin-bottom: 4rem !important;
  }
}
</style>

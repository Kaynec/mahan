<template>
  <div class="loader-parent" v-if="isLoading">
    <div class="loading1"></div>
  </div>
  <div class="container" v-else>
    <div
      @click="moveToReportCardOrExam(item)"
      class="card w-100 d-inline-flex align-items-center m-1 position-relative flex-row flex-wrap border border-white rounded-10 customDiv warning"
      v-for="item in azmoonData"
      v-bind:key="item"
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
          src="../../assets/img/accept-path-light.png"
          class="img"
          alt="active"
        />
      </div>
      <img
        src="../../assets/img/shape.svg"
        class="position-absolute top-50 start-0 translate-middle ml-3"
        alt="angle left icon"
      />
    </div>
  </div>
  <!--  -->
</template>

<script lang="ts" setup>
import { compareAsc } from 'date-fns';
import router from '@/router/';
import { MentorAuthServiceApi } from '@/api/services/mentor/mentor-auth-service';
import alertify from '@/assets/alertifyjs/alertify';
import shamsi_be_miladi from '@/utilities/date-converter';
import { onBeforeMount, reactive, ref } from 'vue';

const { id } = defineProps({
  id: { type: String, required: true }
});

const isLoading = ref(true);
const azmoonData = reactive([] as any);

onBeforeMount(async () => {
  const res = await MentorAuthServiceApi.getStudentExams(id);

  res.data.data.forEach((date: any) => {
    let mDate = new Date(
      shamsi_be_miladi(
        +date.date.split('/')[0],
        +date.date.split('/')[1],
        +date.date.split('/')[2]
      ) as any
    );

    console.log(mDate);
    mDate.setHours(date.time.split(':')[0], date.time.split(':')[0]);

    // let mDate = moment(date.date, 'jYYYY/jM/jD');
    if (compareAsc(mDate, new Date()) <= 0) azmoonData.push(date);
  });
  isLoading.value = false;
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

const moveToReportCardOrExam = (item) => {
  if (item.results && item.results.length) {
    router.push({
      name: 'MentorReportCard',
      params: { id: item._id, studentId: id }
    });
  } else {
    alertify.error('کارنامه این امتحان هنوز در دسترس نیست');
  }
};
</script>

<style lang="scss" scoped>
.container {
  // width: 100%;
  // height: 100%;
  overflow-y: auto;
  padding-bottom: 3rem;
  background-color: red;
  overflow-x: hidden;
}
.card {
  border-radius: 10px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;
  font-family: IRANSans;
  background-color: red;

  &:hover {
    cursor: pointer;
  }

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
      margin-left: 0.4rem;
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

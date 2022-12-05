<template>
  <!-- Spinner -->
  <div class="loader-parent" v-if="isLoading">
    <div class="loading1"></div>
  </div>

  <main class="roadmap" ref="roadmap" v-else>
    <MinimalHeader
      style="top: 0; margin-top: 0; position: absolute"
      title="رودمپ"
      v-if="isMobile.value"
    />
    <DesktopMinimalHeader v-if="!isMobile.value" />

    <section
      class="circles custom"
      ref="circles"
      v-if="allExams && allExams.length"
      v-dragscroll
    >
      <div class="scroll"></div>
      <div
        class="circle animate__animatd animate__fadeIn"
        v-for="(circle, i) in allExams"
        :key="circle._id"
      >
        <div
          class="control-container animate__animated animate__fadeIn"
          :style="`display : ${i === currentIndex ? 'block' : 'none'}`"
        >
          <div class="control" v-if="circle.state === 0">
            <img
              src="@/assets/img/roadmap/angle-left.svg"
              class="shape1"
              @click="moveImg(-1)"
              alt="angle left"
            />
            <img
              src="@/assets/img/roadmap/angle-right.svg"
              class="shape2"
              @click="moveImg(1)"
              alt="angle right"
            />
          </div>

          <div class="control" v-else-if="circle.state === 1">
            <img
              src="@/assets/img/roadmap/angle-left.svg"
              class="shape1"
              @click="moveImg(-1)"
              alt="angle left"
            />
            <img
              src="@/assets/img/roadmap/angle-right.svg"
              class="shape2"
              @click="moveImg(1)"
              alt="angle right"
            />
          </div>

          <div class="control" v-else-if="circle.state === 2">
            <img
              src="@/assets/img/roadmap/angle-left.svg"
              class="shape1"
              @click="moveImg(-1)"
              alt="angle left"
            />
            <img
              src="@/assets/img/roadmap/angle-right.svg"
              class="shape2"
              @click="moveImg(1)"
              alt="angle right"
            />
          </div>
        </div>
        <img
          @click="currentIndex = i"
          src="@/assets/img/roadmap/asset-11@3x.png"
          class="circle-main-img animate__animatd animate__fadeIn"
          alt="circle image"
        />

        <div class="bar-container">
          <div class="text">
            <span> میزان پیشرفت شما </span>
            <span>
              {{
                Math.floor(
                  (circle.totalAnswer / circle.totalQuestion) * 100 || 0
                ) + '%'
              }}
            </span>
          </div>
          <div class="bar">
            <div
              class="bar-child"
              :style="` width : ${
                (circle.totalAnswer / circle.totalQuestion) * 100 || 0
              }% `"
            ></div>
          </div>
        </div>
        <div class="info">{{ circle.title }}</div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { ref, onUpdated } from 'vue';
import { StudentExamApi } from '@/api/services/student/student-exam-service';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import router from '@/router';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { store } from '@/store';
import { baseUrl } from '@/api/apiclient';
import { dragscroll as vDragscroll } from 'vue-dragscroll';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';

const isLoading = ref(true);
const roadmap = ref();
const circles = ref();
const currentIndex = ref(0);
const course = ref({} as any);
const allExams = ref([] as any);
const firstView = ref(true);
const currentUser = ref(store.getters.getCurrentStudent);

const imageUrl = ref('');

imageUrl.value =
  'data:image/jpeg;base64,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';
if (currentUser.value && currentUser.value.profileImage) {
  imageUrl.value = `${baseUrl}student/getProfileImage/${currentUser.value.profileImage}`;
}

const goOnePageBack = () =>
  router.push({
    name: 'Home'
  });

onUpdated(() => {
  if (!firstView.value) return;
  roadmap.value.scrollLeft = -circles.value?.clientWidth;
  firstView.value = false;
});

(async () => {
  const res = await StudentExamApi.getAll();
  course.value = res?.data?.data;
  const historyOfExamPromises = [] as any;
  // Looping Through Sessions of the Course
  for (let i = 0; i < course.value.length; i++) {
    const exam = course.value[i];
    allExams.value[i] = exam;
    historyOfExamPromises.push(StudentExamApi.getResult(exam._id));
  }

  const promises = await Promise.all(historyOfExamPromises);

  promises.forEach((promise: any, idx) => {
    allExams.value[idx] = {
      ...allExams.value[idx],
      totalAnswer: promise.data?.data?.totalAnswer,
      totalQuestion: promise.data?.data?.totalQuestion,
      totalCorrectAnswer: promise.data?.data?.totalCorrectAnswer,
      // state for the img shown in control pad
      state: 1
    };
  });

  isLoading.value = false;
})();

const moveToSelfTestQuestions = (id) =>
  router.push({
    name: 'SelfTestQuestions',
    params: { id }
  });

const moveImg = (amountToAdd: number) => {
  const calc = currentIndex.value + amountToAdd;

  document.querySelectorAll('.control-container').forEach((circle: any) => {
    const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
    if (circle.style.display != 'none') {
      amountToAdd > 0
        ? ((document.querySelector('.roadmap') as any).scrollLeft += width / 2)
        : ((document.querySelector('.roadmap') as any).scrollLeft -= width / 2);
    }
  });

  if (calc >= 0 && calc <= allExams.value.length - 1)
    currentIndex.value += amountToAdd;
};
//
const moveToReportCard = (circle) =>
  router.push({
    name: 'SelfTestReportCard',
    params: { data: JSON.stringify(circle) }
  });
</script>
<style lang="scss" scoped>
.roadmap {
  width: 100vw;
  height: 100%;
  background: url('../../../assets/img/roadmap/3-d-space-scene@3x.png');
  background-position: center;
  background-size: cover;
  background-repeat: repeat;

  .circles {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-end;
    width: 100vw;
    scrollbar-width: thin;
    scrollbar-color: orange red;

    background-position: center;
    background-size: cover;
    background-repeat: repeat;

    overflow-x: auto;

    -webkit-overflow-scrolling: touch; /* Lets it scroll lazy */

    height: 100%;

    .circle {
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      min-width: 75vw;
      margin-right: 2rem;
      margin-left: 2rem;

      .bar-container {
        width: 100%;
        transform: translateY(-1.25rem);
        max-width: 450px;
        .text {
          color: #fff;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          justify-content: space-between;
          font-size: 0.55rem;
          margin: 0.5rem 0;
        }
        .bar {
          width: 100%;
          height: 0.7rem;
          border-radius: 1em;
          position: relative;
          background: rgba(0, 0, 0, 0.308);
          .bar-child {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            color: red;
            background-color: red;
            border-radius: 1em;
          }
        }
      }

      .circle-main-img {
        max-width: 13.5rem;
        object-fit: contain;
        animation: bounce 1s infinite alternate;
        -webkit-animation: bounce 1s infinite alternate;
      }

      .control-container {
        display: flex;
        flex-direction: column;
        margin-left: 1.5rem;
        transform: translateY(-4rem);
        width: 75vw;
        max-width: 450px;
        .img {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          transform: translateY(50%);
        }

        .control {
          z-index: 9999;
          position: relative;
        }

        .shape1 {
          position: absolute;
          width: 1.2rem;
          height: 1.2rem;
          top: 35%;
          left: -1.5rem;
        }
        .shape2 {
          position: absolute;
          width: 1.2rem;
          height: 1.2rem;
          top: 35%;
          right: -1.5rem;
        }
      }
      .info {
        padding: 0.3rem 3.5rem;
        white-space: nowrap;
        background: red;
        border-radius: 1em;
        font-size: 16px;
        color: #fff;
        margin-bottom: 1rem;
      }
    }
  }
}

@keyframes bounce {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-20px);
  }
}
@-webkit-keyframes bounce {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-20px);
  }
}

.scale-enter-active,
.scale-leave-active {
  transform-origin: top;
  transition: transform 0.3s ease-in-out;
}

.scale-enter-to,
.scale-leave-from {
  transform: scaleY(1);
}

.scale-enter-from,
.scale-leave-to {
  transform: scaleY(0);
}

.sm-nav {
  background-color: #171717;
  display: flex;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem;
  max-height: 8vh;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.09), 0 2px 4px 0 rgba(0, 0, 0, 0.19);
  position: fixed; /* Set the navbar to fixed position */
  top: 0; /* Position the navbar at the top of the page */
  width: 100%; /* Full width */
  z-index: 999999999;
  div {
    img {
      width: 29px;
      height: 28px;
      margin: 0 10px 0 0;
      border-radius: 8px;
      border: solid 2px #ddd;
      margin-left: 0.5rem;
    }

    span {
      font-family: IRANSans;
      font-size: 11px;
      font-weight: bold;
    }
  }
}
</style>

<style scoped lang="scss">
.custom {
  cursor: -webkit-grab;
  cursor: -moz-grab;
  cursor: -o-grab;
  cursor: grab;

  &:active {
    cursor: -webkit-grabbing;
    cursor: -moz-grabbing;
    cursor: -o-grabbing;
    cursor: grabbing;
  }
}
.custom {
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
  scrollbar-width: none;
  /* Firefox */
  overflow: scroll;
}

.custom::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
}

/* width */
::-webkit-scrollbar,
::moz-sc {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

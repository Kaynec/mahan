<template>
  <!-- Spinner -->
  <div class="loader-parent" v-show="isLoading">
    <div class="loading1"></div>
  </div>

  <!--  -->
  <main class="roadmap" ref="roadmap" v-if="!isLoading" v-dragscroll>
    <!-- Show Buy Session Component -->
    <BuySession
      v-if="showBuySession"
      :data="allSessions[currentIndex]"
      :allSessions="allSessions"
      @cancel="showBuySession = false"
    />
    <!--  -->
    <MinimalHeader
      style="top: 0; margin-top: 0; position: absolute"
      :title="`رودمپ`"
      v-if="mobile"
    />

    <DesktopMinimalHeader v-show="!mobile" />

    <div
      class="circles custom animate__animatd animate__fadeIn"
      ref="circles"
      v-dragscroll
    >
      <div
        class="circle animate__animatd animate__fadeIn"
        v-for="(circle, i) in allSessions"
        :key="circle._id"
      >
        <div
          class="control-container animate__animated animate__fadeIn"
          :style="`display : ${i === currentIndex ? 'block' : 'none'}`"
        >
          <div class="control" v-if="circle.state === 0">
            <h1>خواندن کتاب</h1>
            <h2>{{ (circle.title as string).substring(0, 25) }}</h2>

            <button @click="showPdf(circle, i)" class="green">
              شروع خواندن کتاب
            </button>
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
            <h1>آزمون خودسنجی</h1>
            <h2>{{ (circle.title as string).substring(0, 25) }}</h2>
            <button class="green" @click="moveToSelfTestQuestions(i, circle)">
              شروع آزمون
            </button>

            <button
              class="red"
              @click="moveToReportCard(circle)"
              v-if="circle.totalQuestion"
            >
              مشاهده کارنامه
            </button>

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
            <h1>ویدیو آموزشی</h1>
            <h2>{{ circle.title }}</h2>
            <button @click="showVideo(circle)" class="green">
              مشاهده ویدیو
            </button>
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

          <div class="img">
            <span @click="circle.state = 0"> 📕 </span>
            <span @click="circle.state = 1"> ✏️ </span>
            <span @click="circle.state = 2"> ▶️ </span>
          </div>
        </div>
        <img
          alt="circle lession img"
          v-if="circle.img"
          :src="circle.img"
          class="circle-main-img"
          @click="currentIndex = i"
        />
        <img
          alt="circle lession img"
          v-else
          src="@/assets/img/roadmap/asset-11.png"
          class="circle-main-img"
          @click="currentIndex = i"
        />

        <div class="bar-container">
          <div class="text">
            <span> میزان پیشرفت شما </span>
            <span>
              {{ Math.floor(getProgressCount(circle)) + '%' }}
            </span>
          </div>
          <div class="bar">
            <div
              class="bar-child"
              :style="` width : ${getProgressCount(circle)}% `"
            ></div>
          </div>
        </div>
        <div class="info">
          {{ (circle.title as string).substring(0, 50) }}...
        </div>
      </div>
    </div>
    <Alert
      v-if="showNotif"
      @convertBoolean="toggleShowNotif"
      :label="messageToShow"
      :text="textToShow"
    >
      <div class="btns" @click="toggleShowNotif">
        <button>برگشت</button>
      </div>
    </Alert>
  </main>
</template>

<script lang="ts" setup>
import { ref, onUpdated } from 'vue';
import { StudentSelfTestApi } from '@/api/services/student/student-selftest-service';
import { useRoute } from 'vue-router';
import router from '@/router';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { baseUrl } from '@/api/apiclient';
import { store } from '@/store';
import Alert from '@/modules/student-modules/alert/alert.vue';
import alertify from '@/assets/alertifyjs/alertify';
import { dragscroll as vDragscroll } from 'vue-dragscroll';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import BuySession from '../azmoon/buy-session.vue';

const isLoading = ref(true);
const roadmap = ref();
const circles = ref();
const currentIndex = ref(0);
const allSessions = ref([] as any);
const Route = useRoute();
const firstView = ref(true);
const showNotif = ref(false);
const toggleShowNotif = () => (showNotif.value = !showNotif.value);
const messageToShow = ref('');
const textToShow = ref('');

// Cacl The Prrcent Of Progress
const getProgressCount = (circle) => {
  console.log(circle);
  return (circle.totalQuestion / circle.questions.length || 0) * 100;
};
//
onUpdated(() => {
  if (firstView.value) {
    if (roadmap.value) {
      roadmap.value.scrollLeft = -circles.value?.clientWidth;
    }
    firstView.value = false;
  }
});

(async () => {
  const res = await StudentSelfTestApi.getSessionByCourse(
    Route.params.id as any
  );

  res.data.data = [...res.data.data];

  const historyOfExamPromises = [] as any;
  // Looping Through Sessions of the Course
  if (res.data.data.length) {
    for (let i = 0; i < res.data.data?.length; i++) {
      const session = {
        ...res.data.data[i]
      };
      if (session.image) {
        session.img = `${baseUrl}course/download-image/${session.image}`;
      }
      allSessions.value[i] = session;

      historyOfExamPromises.push(
        StudentSelfTestApi.selfTestResult({
          course: { _id: Route.params.id },
          session: { _id: session._id }
        })
      );
    }
  }

  // Get The Results for the history of that session

  const promises = await Promise.all(historyOfExamPromises);

  promises.forEach((promise: any, idx) => {
    allSessions.value[idx] = {
      ...allSessions.value[idx],
      ...promise.data.data,
      // state for the img shown in control pad
      state: 1
    };
  });

  isLoading.value = false;
})();

// moving to quetions or prompt for boy

const showBuySession = ref(false);

const moveToSelfTestQuestions = (index, circle) => {
  if (circle.totalQuestion >= circle.questions.length) {
    alertify.error('شما قبلا در این امتحان شرکت کرده اید');
    return;
  }
  if (index >= 1 && !circle.bought) {
    showBuySession.value = true;
  } else
    router.push({
      name: 'SelfTestQuestions',
      params: { id: circle._id }
    });
};

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

  if (calc >= 0 && calc <= allSessions.value.length - 1)
    currentIndex.value += amountToAdd;
};
//
const moveToReportCard = (circle) => {
  router.push({
    name: 'SelfTestReportCard',
    params: { data: JSON.stringify(circle) }
  });
};

const currentUser = ref(store.getters.getCurrentStudent);

const point = ref(0);

let imageUrl =
  'https://images.vexels.com/media/users/3/129616/isolated/preview/fb517f8913bd99cd48ef00facb4a67c0-businessman-avatar-silhouette-by-vexels.png';
if (currentUser.value && currentUser.value.profileImage) {
  imageUrl = `${baseUrl}student/getProfileImage/${currentUser.value.profileImage}`;
}

if (currentUser.value && currentUser.value.point) {
  point.value = currentUser.value.point;
}

const isShowVideo = ref(false);
const currentSession = ref({});
const showVideo = (session) => {
  if (session.video) {
    isShowVideo.value = true;
    currentSession.value = session;
    router.push({
      name: 'Video',
      params: { filename: session.video }
    });
  } else {
    messageToShow.value = ' خطای دریافت';
    textToShow.value = 'ویدیو درس مورد نظر در دسترس نیست';

    toggleShowNotif();
  }
};

const showPdf = (pdf, index) => {
  if (index >= 1 && !store.getters.getCurrentStudent.purchased) {
    alertify.error('لطفا اول برنامه را خریداری کنید');
    return;
  }

  if (pdf.book) {
    router.push({
      name: 'PDF',
      params: { filename: `session/download-file/${pdf.book}` }
    });
  } else {
    messageToShow.value = ' خطای دریافت';
    textToShow.value = 'کتاب درس مورد نظر در دسترس نیست';

    toggleShowNotif();
  }
};
</script>
<style lang="scss" scoped>
//
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
      z-index: 999;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin-right: 1rem;
      margin-left: 1rem;

      .bar-container {
        width: 100%;
        max-width: 450px;
        transform: translateY(-1.25rem);
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
        max-width: 10rem;
        object-fit: contain;
        animation: bounce 1s infinite alternate;
        -webkit-animation: bounce 1s infinite alternate;
      }

      .control-container {
        display: flex;
        flex-direction: column;
        margin-left: 1.5rem;
        transform: translateY(-3rem);
        // margin-top: 5rem;
        .img {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          transform: translateY(50%);
          span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.4rem;
            height: 2.4rem;
            border-radius: 0.7em;
            padding: 0.4rem;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
            background-color: #fff;
            margin: 0.25rem;

            transition: 0.3s all;

            &:hover {
              cursor: pointer;
            }

            &:nth-child(2) {
              transform: translateY(-50%);
            }
            .active {
              background-image: linear-gradient(
                to left,
                #fad961 108%,
                #f76b1c -9%
              );
            }
          }
        }

        .control {
          z-index: 10;
          width: 100%;
          max-width: 13rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.72);
          background-color: #fff;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          position: relative;
          white-space: nowrap;
          padding: 1rem 2rem;
          gap: 0.5rem;
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

        h1 {
          font-size: 12px;
          font-weight: bold;
          color: #171717;
        }

        h2 {
          font-size: 11px;
          text-align: center;
          color: #171717;
        }

        h3 {
          font-size: 11px;
          color: #d21921;
        }
        p {
          color: #000000;
          font-size: 12px;
        }

        .green {
          background: #4ac367;
          border: none;
          color: #fff;
          border-radius: 7.5px;
          font-size: 12px;
          width: 100%;
          flex-grow: 1;
          height: 2rem;
          padding: 0 1.8rem;
          text-align: center;
        }

        .red {
          background: linear-gradient(268deg, #ff545b 6%, #a50d14);
          border: none;
          color: #fff;
          border-radius: 7.5px;
          font-size: 12px;
          width: 100%;
          flex-grow: 1;
          height: 2rem;
          padding: 0 1.8rem;
          text-align: center;
        }
      }

      .info {
        padding: 0.3rem 3.5rem;
        white-space: nowrap;
        background: red;
        border-radius: 1em;
        font-size: 12px;
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
  z-index: 999999;
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

@media screen and (max-width: 1280px) {
  .roadmap {
    padding-bottom: 0;

    .circles {
      /* Lets it scroll lazy */

      .circle {
        .bar-container {
          width: 100%;
          max-width: 375px;
          transform: translateY(-1.25rem);
        }

        .circle-main-img {
          max-width: 7.5rem;
        }

        .control-container {
          .img {
            span {
              width: 2rem;
              height: 2rem;
              padding: 0.3rem;
            }
          }

          .control {
            padding: 0.8rem 1.6rem;
          }

          .shape1 {
            width: 0.8rem;
            height: 0.8rem;
          }
          .shape2 {
            width: 0.8rem;
            height: 0.8rem;
          }

          h1 {
            font-size: 11px;
          }

          h2 {
            font-size: 13px;
          }

          h3 {
            font-size: 9px;
            color: #d21921;
          }
          p {
            color: #000000;
            font-size: 10px;
          }

          .green {
            height: 1.6rem;
            padding: 0 1.3rem;
          }

          .red {
            height: 1.6rem;
            padding: 0 1.3rem;
          }
        }

        .info {
          font-size: 10px;
          margin-bottom: 0.5rem;
        }
      }
    }
  }
}
</style>

<template>
  <DesktopMinimalHeader v-if="!isMobile.value" />
  <div class="user-home">
    <!-- Timed Message -->
    <TimedMessage :msg="msg" v-if="msg" @cancel="msg = ''" />
    <!--  -->
    <Header />
    <section class="mobile-only" v-if="isMobile.value">
      <div @click="$router.push({ name: 'ContactBackup' })">
        <img
          src="@/assets/img/home-icons/support.png"
          :class="`${$route.name == 'ContactBackup' ? 'active' : ''}`"
          alt="backup"
        />
      </div>
      <div @click="$router.push({ name: 'contactUs' })">
        <img
          src="@/assets/img/home-icons/contact-us.png"
          :class="`${$route.name == 'contactUs' ? 'active' : ''}`"
          alt="backup"
        />
      </div>
      <div @click="$router.push({ name: 'studentShop' })">
        <img
          :class="`${$route.name == 'studentShop' ? 'active' : ''}`"
          src="@/assets/img/home-icons/shop.png"
          alt="shop"
        />
      </div>
      <div @click="$router.push({ name: 'MyProfile' })">
        <img
          src="@/assets/img/home-icons/profile.png"
          :class="`${$route.name == 'MyProfile' ? 'active' : ''}`"
          alt="StudentProfile"
        />
      </div>
    </section>
    <!-- Cards -->
    <section class="cards">
      <img
        src="@/assets/img/home-icons/home-page/selftest.png"
        alt="selftest"
        @click="$router.push({ name: 'SelfTest' })"
      />
      <img
        src="@/assets/img/home-icons/home-page/one-lesson.png"
        alt="selftest"
        @click="$router.push({ name: 'SelfSelfTesttest' })"
      />
      <img
        src="@/assets/img/home-icons/home-page/book.png"
        alt="selftest"
        @click="
          $router.push({
            name: 'ShopBookList',
            params: { id: '627b5419c6a709fd06348039' }
          })
        "
      />
      <img
        src="@/assets/img/home-icons/home-page/note.png"
        alt="selftest"
        @click="$router.push({ name: 'SelfTestNote' })"
      />
      <img
        src="@/assets/img/home-icons/home-page/comp-test.png"
        alt="selftest"
        @click="$router.push({ name: 'compTest' })"
      />
      <img
        src="@/assets/img/home-icons/home-page/support.png"
        alt="selftest"
        @click="$router.push({ name: 'ContactBackup' })"
      />
    </section>
    <!--  -->
    <section>
      <div class="hero-container animate__animated animate__fadeIn">
        <img
          class="animate__animatd animate__fadeIn hero"
          :key="currentImg"
          :src="currentImg"
          alt="current slider img"
          @touchstart="touchstart"
          @touchend="touchend"
        />
        <div class="img-control">
          <span
            v-for="i in images.length"
            :key="i"
            :class="`${currentIndex + 1 == i ? 'rectangle' : 'dot'}`"
            @click="currentIndex = i - 1"
          >
          </span>
        </div>
      </div>
    </section>
    <!-- Count Down -->
    <section class="count-down" v-for="item in countDown">
      <span class="second">
        {{ timeForTemplate.second }}
      </span>
      <span class="minute">
        {{ timeForTemplate.minute }}
      </span>
      <span class="hour">
        {{ timeForTemplate.hour }}
      </span>
      <span class="day"> {{ item.remaining }} </span>
    </section>
    <!-- Select from List -->
    <span class="header">ازبین محصولات متنوع انتخاب کنید</span>
    <section class="choose-parent drag custom" v-dragscroll.self>
      <div class="choose-item">
        <img
          src="@/assets/img/home-icons/card.png"
          alt="card"
          class="card-img"
        />

        <div class="first">
          <img src="@/assets/img/home-icons/card-img.png" alt="card img" />
          <span> کتب درسی </span>
        </div>
        <div class="second">
          <span> لورم ایپسوم متن ساختگی با تولید </span>
          <span class="see"> مشاهده </span>
        </div>
      </div>
      <div class="choose-item">
        <img
          src="@/assets/img/home-icons/card.png"
          alt="card"
          class="card-img"
        />

        <div class="first">
          <img src="@/assets/img/home-icons/card-img.png" alt="card img" />
          <span> کتب درسی </span>
        </div>
        <div class="second">
          <span> لورم ایپسوم متن ساختگی با تولید </span>
          <span class="see"> مشاهده </span>
        </div>
      </div>
      <div class="choose-item">
        <img
          src="@/assets/img/home-icons/card.png"
          alt="card"
          class="card-img"
        />

        <div class="first">
          <img src="@/assets/img/home-icons/card-img.png" alt="card img" />
          <span> کتب درسی </span>
        </div>
        <div class="second">
          <span> لورم ایپسوم متن ساختگی با تولید </span>
          <span class="see"> مشاهده </span>
        </div>
      </div>
      <div class="choose-item">
        <img
          src="@/assets/img/home-icons/card.png"
          alt="card"
          class="card-img"
        />
        <div class="first">
          <img src="@/assets/img/home-icons/card-img.png" alt="card img" />
          <span> کتب درسی </span>
        </div>
        <div class="second">
          <span> لورم ایپسوم متن ساختگی با تولید </span>
          <span class="see"> مشاهده </span>
        </div>
      </div>
    </section>
    <!-- Second Slider -->
    <section>
      <div class="hero-container animate__animated animate__fadeIn">
        <img
          class="animate__animatd animate__fadeIn hero"
          :key="currentImg2"
          :src="currentImg2"
          alt="current slider img"
          @touchstart="touchstart"
          @touchend="touchend"
        />
        <div class="img-control">
          <span
            v-for="i in images.length"
            :key="i"
            :class="`${currentIndex2 + 1 == i ? 'rectangle' : 'dot'}`"
            @click="currentIndex2 = i - 1"
          >
          </span>
        </div>
      </div>
    </section>
  </div>
  <!-- Azmoon -->
  <Footer />
  <Azmoon v-if="showAzmoon" @convertBoolean="changeShowAzmoon(false)" />
</template>
<script setup lang="ts">
import { onMounted, onBeforeMount, ref, computed, onBeforeUnmount } from 'vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import Footer from '@/modules/student-modules/footer/footer.vue';
import Header from '@/modules/student-modules/header/header.vue';
import Azmoon from '@/modules/student-modules/azmoon/azmoon.vue';
import { dragscroll as vDragscroll } from 'vue-dragscroll';
import { StudentMessageApi } from '@/api/services/student/student-message-service';
import { store } from '@/store';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import TimedMessage from '@/modules/student-modules/timed-message.vue';

//
const msg = ref('');
//

const currentImg = computed(() => {
  return require('../../../assets/img/home-icons/home-page/' +
    images[Math.abs(currentIndex.value) % images.length]);
});
const currentImg2 = computed(() => {
  return require('../../../assets/img/home-icons/home-page/' +
    images[Math.abs(currentIndex.value) % images.length]);
});

const showAzmoon = ref(false);
let timer = null as any;
let currentIndex = ref(0);
let currentIndex2 = ref(0);
const id = ref('');
let touchstartX = 0;
let touchendX = 0;
const images = ['comptest.png', 'class.png'];

onBeforeMount(async () => {
  //
  const getCurrentHourAndMinute =
    new Date().getHours().toString().padStart(2, '0') +
    ':' +
    new Date().getMinutes().toString().padStart(2, '0');

  // This Part For Scheuled Message

  const showedMessage = store.state.students.showedMessage;

  if (showedMessage) return;

  try {
    const message = await StudentMessageApi.getForTime(getCurrentHourAndMinute);

    msg.value = message.data.data.description;
    store.commit(StudentMutationTypes.SET_SHOW_MSG);
  } catch (error) {
    console.log(error);
  }
  //
});

// Count Down

interface ICountDown {
  title: string;
  description: string;
  countNumber: number;
  remaining: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

const countDown = ref<ICountDown[]>([]);

//
StudentMessageApi.getCountDown()
  .then((res) => {
    //

    const data = res.data.data as ICountDown[];

    countDown.value = data;
  })
  .catch((error) => console.log(error));

onMounted(() => {
  startSlide();
});

const startSlide = () => {
  timer = setInterval(next, 5000);
};

// Timer For Hour Minute Second

const timeForTemplate = ref({
  hour: new Date().getHours().toString().padStart(2, '0'),
  minute: new Date().getMinutes().toString().padStart(2, '0'),
  second: new Date().getSeconds().toString().padStart(2, '0')
});

let timeID = setInterval(() => {
  timeForTemplate.value = {
    hour: new Date().getHours().toString().padStart(2, '0'),
    minute: new Date().getMinutes().toString().padStart(2, '0'),
    second: new Date().getSeconds().toString().padStart(2, '0')
  };
}, 1000);

onBeforeUnmount(() => {
  clearInterval(timeID);
});

//

const next = () => {
  clearInterval(timer);
  timer = setInterval(next, 5000);
  currentIndex.value = (currentIndex.value + 1) % images.length;
};
const prev = () => {
  currentIndex.value = (currentIndex.value - 1) % images.length;
};
const nextForSecondSlider = () => {
  clearInterval(timer);
  timer = setInterval(next, 5000);
  currentIndex2.value = (currentIndex2.value + 1) % images.length;
};
const prevForSecondSlider = () => {
  currentIndex2.value = (currentIndex2.value - 1) % images.length;
};
const touchstart = (e) => {
  touchstartX = e.changedTouches[0].screenX;
};
const touchend = (e) => {
  touchendX = e.changedTouches[0].screenX;
  handleGesture();
};

const handleGesture = () => {
  if (touchendX < touchstartX) prev();

  if (touchendX > touchstartX) next();
};

const changeShowAzmoon = (boolean: boolean) => {
  showAzmoon.value = boolean;
};
</script>
<style lang="scss" scoped>
@import '@/css-variable/Global.scss';

.user-home {
  width: 100%;
  height: 100%;
  max-width: 650px;
  font-family: IRANSans;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 1rem;
  padding-top: 8vh;

  .mobile-only {
    width: 90%;
    margin: 1rem auto;
    box-shadow: 0px -2px 4px rgba(227, 227, 227, 0.25), 0px 2px 4px #e3e3e3;
    display: flex;

    gap: 1rem;
    justify-content: space-between;
    background-color: white;
    padding: 1rem;
    border-radius: 20px;

    img {
      width: 3rem;
    }
  }

  .cards {
    background-color: white;
    border-radius: 2rem;
    width: 90%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    gap: 2rem;
    padding: 2rem 0;
    box-shadow: 0px -2px 4px rgba(227, 227, 227, 0.25), 0px 2px 4px #e3e3e3;

    img {
      max-width: 100%;
      cursor: pointer;
    }
  }

  .hero-container {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;
    padding: 0;

    .img-control {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      .dot {
        height: 12px;
        width: 12px;
        background-color: rgba(237, 27, 36, 0.4);
        border-radius: 50%;
        display: inline-block;
        margin: 0 5px;
      }
      .rectangle {
        width: 36px;
        border-radius: 10px;
        background-color: #d21921;
        height: 12px;
      }
    }

    .hero {
      width: 100%;
      margin: 1rem 0 0;
    }
  }

  .header {
    font-size: 0.9rem;
    font-weight: bold;
    text-align: right;
    margin: 1rem;
  }

  .count-down {
    // background-color: red;

    width: 90%;
    margin: 1rem auto;
    border-radius: 20px;
    // padding: 2.5rem 0;

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-items: center;
    color: white;

    font-size: 2.5rem;

    background: $dark;

    span {
      padding: 2.5rem 0;
      width: 100%;
      text-align: center;
      border-right: 3px solid white;
      position: relative;

      //
      &::before {
        position: absolute;
        content: 'SALAM';
        bottom: 0;
        left: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.194);
        font-size: 1rem;
      }
    }

    .day {
      background: linear-gradient(180deg, #fa2e33 0%, #d30e13 100%);
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      &::before {
        border-bottom-left-radius: 20px;
        content: 'روز';
      }
    }
    .hour {
      &::before {
        content: 'ساعت';
      }
    }
    .minute {
      &::before {
        content: 'دقیقه';
      }
    }
    .second {
      &::before {
        border-bottom-right-radius: 20px;
        content: 'ثانیه';
      }
    }
  }
  .choose-parent {
    display: flex;
    // flex-wrap: nowrap;
    overflow: hidden;
    overflow-x: auto;
    min-height: 250px;
    width: 90%;
    margin: 0 auto;
    gap: 1rem;

    .choose-item {
      background-color: white;
      //
      box-shadow: 0px -2px 4px rgba(227, 227, 227, 0.25), 0px 2px 4px #e3e3e3;
      border-radius: 10px;
      font-size: 0.7rem;
      min-width: 15rem;
      .card-img {
        width: 100%;
      }

      .first {
        border-bottom: 2px solid #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 0.3rem;
        padding: 1rem;

        //
        .card-img-sm {
          padding: 1.5rem;
          border-radius: 1rem;
          background-color: $dark;
          width: 3rem;
          height: 3rem;
          img {
            width: 100%;
            object-fit: cover;
          }
        }
      }
      .second {
        padding: 1rem;
        display: flex;
        justify-content: space-between;

        .see {
          color: #d21921;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .user-home {
    padding: 8rem 0 3rem 0;
  }
  .cards {
    img {
      width: 80%;
    }
  }
}
</style>

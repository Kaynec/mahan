<template>
  <!-- <div class="desktop" v-if="!mobile"></div> -->
  <main class="class" :style="`padding-top: ${mobile ? '' : '6vh'}`">
    <DesktopMinimalHeader v-if="!mobile" />
    <Header onePageBack="Home" />
    <MinimalHeader v-if="mobile" title="آزمون خودسنجی" onePageBack="Home" />

    <div
      class="hero"
      :style="`margin-top: ${mobile ? '' : '50px'} ; margin-bottom: ${
        mobile ? '' : '6rem'
      }`"
    >
      <img
        src="@/assets/img/contact-us-pc.png"
        alt="header image of self test"
      />
    </div>

    <!-- <img src="../../../assets/img/selftest.png" alt="hero img" class="hero" /> -->
    <div class="grid animate__animated animate__fadeInUp">
      <div
        class="Card animate__animated animate__fadeIn"
        v-for="course in allCourses"
        :key="course._id"
        @click="movetoRoadmap(course._id)"
      >
        <div v-if="!course.img" class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>

        <img v-else :src="course.img" alt="course image" />

        <span> {{ course.title }}</span>
      </div>
    </div>
    <div class="img-container">
      <img
        src="@/assets/img/class/pencil.png"
        alt="pencil icon"
        class="pencil"
        style="animation: lightSpeedInLeft; animation-duration: 0.5s"
        @click="openNote"
      />

      <i
        class="fas fa-bookmark bookmarked"
        style="animation: lightSpeedInRight; animation-duration: 0.5s"
        @click="openBookmarked"
      ></i>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import router from '@/router';
import { StudentSelfTestApi } from '@/api/services/student/student-selftest-service';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { baseUrl } from '@/api/apiclient';
import Header from '@/modules/student-modules/header/header.vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';

const allCourses = ref([] as any);

(async () => {
  const res = await StudentSelfTestApi.AllCourses();
  allCourses.value = res.data.data;
  allCourses.value.forEach((element, idx) => {
    if (element.image) {
      const imageUrl = `${baseUrl}course/download-image/${element.image}`;

      allCourses.value[idx].img = imageUrl;
    } else {
      allCourses.value[idx].img =
        'https://api.mahanplus.com/api/course/download-image/image-1643532340814-image2.png';
    }
  });
})();

const classInfo = ref(false);
const toggleClassInfo = () => (classInfo.value = !classInfo.value);

const openNote = () => {
  router.push({
    name: 'SelfTestNote'
  });
};

const movetoRoadmap = (id: string) => {
  router.push({ name: 'CustomGroupPage', params: { id: id } });
};

const openBookmarked = () => {
  router.push({ name: 'QuestionsChoosenList' });
};
</script>

<style lang="scss" scoped>
.class {
  width: 100%;
  overflow-x: hidden;
  position: relative;
  height: 100%;
  overflow-y: auto;
  max-width: 750px;

  .hero {
    width: 92.5%;
    margin: 0 auto;
    max-width: 1000px;
    padding-top: 2rem;

    max-height: 300px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: repeat(auto-fit, minmax(180px, 1fr));
    grid-gap: 0.7rem;
    padding: 0.9rem;
    height: fit-content;
    padding-bottom: 7.25rem;
    background-color: white;
    box-shadow: -2px 2px 3px 0 rgba(0, 0, 0, 0.08);
    width: 92.5%;
    margin: 1rem auto;
    max-width: 1000px;
    padding-top: 2rem;
    border-radius: 25px;

    .Card {
      padding: 11px 36px 16.6px 38px;
      border-radius: 14.7px;
      display: flex;
      flex-direction: column;
      font-family: IRANSans;
      align-items: center;
      transition: all 0.3s;
      width: 100%;

      &:hover {
        cursor: pointer;
        transform: scale(0.95);
      }

      img {
        width: 100%;
        height: 100%;
        max-width: 5rem;
        max-height: 5rem;
        aspect-ratio: 1;
      }

      span {
        margin: 7px 0 0;
        font-family: IRANSans;
        font-size: 0.715rem;
        color: #646464;
        text-align: center;
      }
    }
  }

  .img-container {
    position: fixed;
    width: 100%;
    bottom: 0;
  }
  .pencil {
    position: fixed;
    bottom: 0;
    left: 0;
    max-width: 52px;
    max-height: 52px;
    margin-bottom: 2rem;
    margin-left: 1rem;
    object-fit: contain;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    border-radius: 15px;

    transition: 0.3s all;
    &:hover {
      cursor: pointer;
      transform: scale(1.05);
    }
  }

  .bookmarked {
    // position: fixed;
    bottom: 0;
    right: 0;
    margin-bottom: 1rem;
    margin-right: 1rem;
    border-radius: 15px;
    background: rgb(102, 15, 15);
    font-size: 1.75rem;
    padding: 1rem 1.25rem;
    color: white;

    transition: 0.3s all;
    &:hover {
      cursor: pointer;
      transform: scale(1.05);
    }
  }
}
</style>

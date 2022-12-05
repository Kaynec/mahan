<template>
  <MentorDesktopHeader v-if="!isMobile.value" />
  <div
    class="my-profile"
    :style="`padding-top : ${!isMobile.value ? '3rem' : ''}`"
  >
    <MinimalHeader title="پروفایل من" onePageBack="MentorProfile" />
    <!-- Red Div -->
    <div class="info animate__animated animate__fadeIn">
      <div class="right">
        <img :src="imageUrl" class="profile-image" />
        <router-link class="edit" to="edit-profile">
          ویرایش
          <i class="fas fa-angle-left"></i>
        </router-link>
      </div>
      <div class="left">
        <!-- Change This Info Later -->
        <h4>{{ `${currentMentor.firstname} ${currentMentor.lastname}` }}</h4>
        <h6>{{ currentMentor.shortDescription }}</h6>
        <div class="left-info">
          <span> شماره همراه : </span>
          <span v-if="currentMentor.phone">
            {{ toPersianNumbers(currentMentor.phone) }}
          </span>
        </div>
        <span>
          {{ currentMentor.email }}
        </span>
      </div>
    </div>
    <!-- Dialogs -->

    <div class="container">
      <div
        ref="Dialog"
        class="dialog animate__animated animate__fadeIn"
        v-for="item in data"
        :key="item.label"
        @touchstart="touchstart"
        @touchend="touchend"
        @click="clicked(item.component)"
      >
        <span> {{ item.label }} </span>
        <i class="fas fa-angle-left"></i>
      </div>
    </div>
    <!--  -->
    <!-- <Footer v-if="isMobile.value" /> -->
  </div>
</template>
<script setup lang="ts">
import { defineComponent, reactive } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import router from '@/router';
import { store } from '@/store';
import { baseUrl } from '@/api/apiclient';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { MentorActionTypes } from '@/store/modules/mentor/action-types';
import MentorDesktopHeader from '@/modules/mentor-main/mentor-header.vue';

let currentMentor = reactive(store.getters.getCurrentMentor);
let imageUrl =
  'data:image/jpeg;base64,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';
if (currentMentor && currentMentor.profileImage) {
  imageUrl = `${baseUrl}mentor/getProfileImage/${currentMentor.profileImage}`;
}

const goOnePageBack = () => router.go(-1);

const data = reactive([
  {
    label: 'ویرایش رزومه',
    component: 'EditCV'
  },
  {
    label: 'لیست کاربران',
    component: 'MentorStudents'
  },
  {
    label: 'مشاهده درخواست ها',
    component: 'Requests'
  },
  {
    label: 'خروج از پنل کاربری',
    component: 'LogOut'
  }
]);

const touchstart = (e: any) => {
  e.target.classList.add('active');
};

const touchend = (e: any) => {
  e.target.classList.remove('active');
};
const clicked = (component: string) => {
  if (component != 'LogOut')
    router.push({
      name: component
    });
  else logout();
};

const logout = () => {
  store.dispatch(MentorActionTypes.LOG_OUT_MENTOR).then((res) => {
    if (res) router.push({ name: 'MentorLogin' });
  });
};
</script>

<style lang="scss" scoped>
body {
  overflow: hidden;
}
.my-profile {
  width: 100%;
  height: 100%;
  max-width: 1000px;

  font-family: IRANSans;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .info {
    width: 95%;
    overflow: hidden;
    margin: 0.9rem auto 0.3rem;
    height: fit-content;
    background: linear-gradient(
      to top left,
      rgb(189, 39, 43) 0%,
      rgb(189, 39, 43) 50%,
      rgba(189, 39, 43, 0.95) 50%,
      rgba(189, 39, 43, 0.95) 100%
    );
    display: flex;
    justify-content: center;
    justify-content: flex-start;
    align-items: center;
    border-radius: 15px;
    min-height: 15rem;
    height: auto;

    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      flex-basis: 35%;
      height: 100%;
      gap: 0.3rem;

      // fallback
      @supports not (aspect-ratio: 1) {
        img {
          position: absolute;
          transform: translate(-50%);
          left: 50%;
          top: 1.5rem;
          border-radius: 50%;
          width: 7rem;
          object-fit: cover;
          height: 7rem;
        }

        .edit {
          margin-top: 6rem;
        }
      }

      img {
        max-width: 8rem;
        border-radius: 50px;
        padding: 2px;
        width: 6rem;
        height: 6rem;
        aspect-ratio: 1;
        border: solid 4.4px rgba(255, 255, 255, 0.21);
        object-fit: cover;
      }

      .edit {
        border-radius: 50px;
        border: solid 2px #fff;
        text-decoration: none;
        position: relative;
        padding: 0.5rem 1.5rem;
        color: white;
        font-size: 9.2px;
        width: 5.5rem;
        // margin-top: 1rem;

        i {
          position: absolute;
          left: 0;
          top: 35%;
          margin-left: 10%;
        }
      }
    }

    .left {
      color: white;
      white-space: nowrap;
      margin-left: 0.7rem;
      margin-right: 0.7rem;

      h4 {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        color: #fff;
        margin-bottom: 1rem;
      }

      h6 {
        font-size: 14px;
        text-align: right;
        color: #fff;
        border-bottom: solid 1px white;
        padding-bottom: 1rem;
      }

      .left-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 10px;
        font-weight: 300;
        margin-top: 1rem;
        gap: 1rem;

        span {
          line-height: 1.8;
        }
      }
    }
  }

  .container {
    width: 100%;
    overflow-y: auto;
    padding-bottom: 3rem;
    padding-bottom: 5rem;

    .dialog {
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);
      background-color: #fff;
      width: 100%;
      border-radius: 12px;
      color: #171717;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      margin: 0.5rem 0;
      transition: all 0.3s ease-in-out;

      &:hover {
        background: rgba(221, 214, 214, 0.432);
        cursor: pointer;
      }

      span {
        font-size: 13px;
        font-weight: bold;
      }

      .fa-angle-left {
        color: black !important;
        font-size: 14px;
      }
      .label {
        font-family: IRANSans;
        font-size: 12px;
        font-weight: 500;
      }
    }
    .active {
      background-color: rgba(177, 16, 21, 0.96);
      color: #fff;

      .fa-angle-left {
        color: #fff !important;
      }
    }
  }
}
</style>

<template>
  <!-- <div class="desktop" v-if="!isMobile.value"></div> -->
  <DesktopMinimalHeader v-if="!isMobile.value" />
  <div class="my-profile">
    <CountDown
      v-if="showCountDown"
      @cancel="
        () => {
          showCountDown = false;
          alertify.error('خطایی رخ داده است');
        }
      "
      @success="
        () => {
          showCountDown = false;
          alertify.success('کانت داون با موفقیت ساخته شد');
        }
      "
    />
    <Header />

    <MinimalHeader title="پروفایل من" onePageBack="Home" />
    <!-- Red Div -->
    <div class="info animate__animated animate__fadeIn">
      <div class="right">
        <img :src="imageUrl" class="profile-image" alt="avatar picture" />
        <router-link class="edit" to="edit-profile">
          ویرایش
          <i class="fas fa-angle-left"></i>
        </router-link>
      </div>
      <div class="left">
        <!-- Change This Info Later -->
        <h4>{{ `${currentUser.firstname} ${currentUser.lastname}` }}</h4>
        <h6>{{ currentUser.point }} امتیاز</h6>
        <div class="left-info">
          <span>
            {{ gradeName }} :
            <br />
            شماره همراه :
          </span>
          <span>
            {{ groupName }} <br />
            {{ toPersianNumbers(currentUser.phone) }}
          </span>
        </div>
      </div>
    </div>
    <!-- Dialogs -->

    <div class="container animate__animated animate__fadeIn">
      <div
        ref="Dialog"
        class="dialog"
        v-for="item in data"
        :key="item"
        @touchstart="touchstart"
        @touchend="touchend"
        @click="clicked(item.component)"
      >
        <span> {{ item.label }} </span>
        <i class="fas fa-angle-left"></i>
      </div>
    </div>
    <!--  -->
    <Footer />
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import Footer from '@/modules/student-modules/footer/footer.vue';
import router from '@/router';
import { store } from '@/store';
import { StudentActionTypes } from '@/store/modules/student/action-types';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { baseUrl } from '@/api/apiclient';
import Header from '@/modules/student-modules/header/header.vue';
import CountDown from '@/modules/student-modules/message/count-down.vue';
import alertify from '@/assets/alertifyjs/alertify';

const showCountDown = ref(false);

let currentUser = reactive(store.getters.getCurrentStudent);

let groupName = ref(currentUser.group.title);
let gradeName = ref(currentUser.grade.title);
const toPersianNumbers = (number: any) => {
  var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return number.toString().replace(/[0-9]/g, function (w: any) {
    return id[+w];
  });
};

// This Updates The Database
store.dispatch(StudentActionTypes.CURRENT_STUDENT);

let imageUrl =
  'data:image/jpeg;base64,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';
if (currentUser && currentUser.profileImage) {
  imageUrl = `${baseUrl}student/getProfileImage/${currentUser.profileImage}`;
}

const goOnePageBack = () => router.go(-1);

const data = reactive([
  {
    label: 'دعوت از دوستان',
    component: 'InviteFriends'
  },
  {
    label: 'ثبت کانت داون',
    component: 'countDown'
  },
  {
    label: ' سوابق خرید ',
    component: 'PurchaseHistory'
  },
  {
    label: '  امتیازات',
    component: 'ProfilePoints'
  },
  {
    label: ' پیام های دریافتی ',
    component: 'Inbox'
  },
  {
    label: 'تازه های کنکور',
    component: 'News'
  },
  {
    label: 'خروج از پنل کاربری',
    component: 'logOut'
  }
]);

const touchstart = (e: any) => {
  e.target.classList.add('active');
};

const touchend = (e: any) => {
  e.target.classList.remove('active');
};
const clicked = (component: string) => {
  if (component === 'countDown') {
    showCountDown.value = true;
  } else if (component === 'logOut') {
    logout();
  } else
    router.push({
      name: component
    });
};

const logout = () => {
  store.dispatch(StudentActionTypes.LOG_OUT_STUDENT).then((res) => {
    if (res) router.push({ name: 'StudentLogin' });
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
  font-family: IRANSans;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  display: flex;
  max-width: 1000px;

  .info {
    width: 95%;
    overflow: hidden;
    margin: 0.9rem auto 0.3rem;
    height: fit-content;
    background: #2b2d42;
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
        border: solid 0.8px #fff;
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
      margin-left: 0.9rem;
      margin-right: 0.7rem;

      h4 {
        font-size: clamp(1.05rem, 1.2rem, 1.7rem);
        font-weight: bold;
        text-align: right;
        color: #fff;
        margin-bottom: 1rem;
      }

      h6 {
        font-size: clamp(0.833rem, 0.95rem, 1.1rem);
        text-align: right;
        color: #fff;
        border-bottom: solid 1px rgba(225, 189, 186, 0.49);
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
        background-color: rgba(255, 255, 255, 0.397);
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

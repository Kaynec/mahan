<template>
  <div class="Forget-the-password" :class="`${mobile ? '' : 'desktop'}`">
    <!-- This Img is White  -->
    <img
      src="@/assets/img/mahan-logo.png"
      v-if="mobile"
      alt="logo"
      class="logo-mahan"
    />
    <!-- this img is black since background in mobile version is white -->
    <img class="logo-mahan" src="@/assets/img/logo-mahan.png" v-else />

    <!-- Main Part -->
    <form
      @submit.prevent="sendToHome()"
      class="Rectangle animate__animated animate__fadeIn"
    >
      <h6
        style="font-family: IRANSans; margin-bottom: 1rem"
        class="text-nowrap text-center"
      >
        تغییر رمز کاربری
      </h6>

      <label class="floating-label custom-label">
        <input
          type="text"
          v-model="model.username"
          placeholder=""
          @blur="v$.username.$touch()"
          disabled
        />
        <span
          :style="`${
            model.username
              ? `
           transform: translateY(-0.25rem);
    right: 1%;
    font-size: 0.45rem;
    padding: 0 0.25rem;
    background-color: white;
          `
              : ''
          }`"
        >
          نام کاربری
        </span>
      </label>

      <p
        v-for="(error, index) in v$.username.$errors"
        :key="index"
        class="text-danger text-bold"
        style="font-family: IRANSans"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label custom-label">
        <input
          type="password"
          v-model="model.password"
          placeholder=""
          @blur="v$.password.$touch()"
        />
        <span
          :style="`${
            model.password
              ? `
           transform: translateY(-0.25rem);
    right: 1%;
    font-size: 0.45rem;
    padding: 0 0.25rem;
    background-color: white;
          `
              : ''
          }`"
        >
          رمز عبور
        </span>
      </label>

      <p
        v-for="(error, index) in v$.password.$errors"
        :key="index"
        class="text-danger text-bold"
        style="font-family: IRANSans"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label custom-label">
        <input
          type="password"
          v-model="model.repassword"
          placeholder=""
          @blur="v$.repassword.$touch()"
        />
        <span
          :style="`${
            model.repassword
              ? `
           transform: translateY(-0.25rem);
    right: 1%;
    font-size: 0.45rem;
    padding: 0 0.25rem;
    background-color: white;
          `
              : ''
          }`"
        >
          تکرار رمز عبور
        </span>
      </label>

      <p
        v-for="(error, index) in v$.repassword.$errors"
        :key="index"
        class="text-danger text-bold"
        style="font-family: IRANSans"
      >
        {{ error.$message }}
      </p>

      <button class="button-linear">
        <span
          v-if="isSendingAMainReq"
          style="width: 1.3rem; height: 1.3rem"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span v-else> تایید </span>
      </button>

      <p
        @click="cancel()"
        class="text-custom text text-nowrap text-center hover-make-big"
        style="font-family: IRANSans; font-size: 0.75rem"
      >
        برگشت به صفحه ورود
      </p>
    </form>
    <!--  -->
    <img
      style="margin-top: 2rem"
      v-show="!mobile"
      src="@/assets/img/mahan.png"
      alt="logo"
    />
  </div>
</template>

<script setup>
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import { useStudentStore } from '@/store';
import { computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import { sameAs, helpers, required, minLength } from '@vuelidate/validators';
import { ref } from 'vue';
import alertify from '@/assets/alertifyjs/alertify';
import router from '@/router';

const route = useRoute();

const code = route.params.code;

const isSendingAMainReq = ref(false);

const model = reactive({
  username: JSON.parse(useStudentStore().getters.getAuthObject),
  password: '',
  repassword: ''
});

const rules = computed(() => ({
  username: {
    required: helpers.withMessage('لطفا نام کاربری خود را وارد کنید', required)
  },
  password: {
    required: helpers.withMessage(
      'لطفا رمز عبور جدید خود را  وارد کنید',
      required
    ),
    minLength: helpers.withMessage(
      'رمز عبور باید حداقل 8 رقم باشد',
      minLength(8)
    )
  },
  repassword: {
    required: helpers.withMessage(
      'لطفا رمز عبور  خود را دوباره وارد کنید',
      required
    ),
    sameAs: helpers.withMessage(
      'رمز عبور و تکرار رمز عبور باید یکسان باشند',
      sameAs(model.password)
    )
  }
}));

const v$ = useVuelidate(rules, model);

const sendToHome = async () => {
  v$.value.$touch();

  if (v$.value.$invalid) return;

  isSendingAMainReq.value = true;
  try {
    const res = await StudentAuthServiceApi.changePassword({
      code: code,
      username: model.username,
      newPassword: model.password
    });

    isSendingAMainReq.value = false;

    router.push({ name: 'StudentLogin' });

    alertify.success('رمز عبور شما با موفقیت عوض شد');
  } catch (e) {
    isSendingAMainReq.value = false;
  }
};
</script>

<style lang="scss" scoped>
.desktop {
  background: url('../../../assets/img/desktop-bg@2x.png') center center
    no-repeat;
  background-size: cover;
  font-family: IRANSans;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.Forget-the-password {
  width: 100vw;
  height: 100%;
  padding: 37px 24.6px 156px 24px;
  background-color: #f6f8fa;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.text-custom {
  font-size: 0.55rem;
  font-weight: bold;
}
.Rectangle {
  width: 90vw;
  height: 315px;
  max-width: 375px;
  padding: 26px 20px 14px 21px;
  border-radius: 10px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.97);

  .btn-confirm {
    width: 269px;
    height: 51px;
    padding: 14px 120px 15px 121px;
    border-radius: 15px;
    background-image: linear-gradient(268deg, #ff545b 126%, #a50d14 -24%);

    span {
      width: 85px;
      height: 24px;
      font-family: IRANSans;
      font-size: 15.3px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      cursor: pointer;

      &:hover {
        transform: scale(1.08);
      }
    }
  }

  .Rectangle-header {
    margin: 0 47px 23px 48px;
    font-family: IRANSans;
    font-size: 19px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -2.09px;
    text-align: center;
    color: #171717;
  }

  .Rectangle-label {
    opacity: 0.8;
    font-family: IRANSans;
    text-align: center;
    color: rgba(28, 25, 57, 0.8);
  }

  .inputs {
    width: 270px;
    height: 50px;
    margin: 44px 0 20px;
    border-radius: 10px;
    border: solid 1px #c8c8c8;
    background-color: #fff;
    text-align: center;
    font-family: IRANSans;
    font-size: 17px;
    text-align: center;
    color: #888;
  }

  .cancel {
    width: 109px;
    height: 21px;
    margin: 18px 80px 0 81px;
    font-family: IRANSans;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -2px;
    text-align: center;
    color: #ed1b24;
  }
}
img.logo-mahan {
  margin: 60px;
  width: 190px;
  height: 90px;
  object-fit: contain;
}
.btn-confirm {
  width: 269px;
  height: 51px;
  border-radius: 15px;
  background: rgb(241, 24, 24);
  border: none;
  span {
    width: 85px;
    height: 24px;
    font-family: IRANSans;
    font-size: 15.3px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
  }
}
.phone-display {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
  span {
    font-size: 15px;
    color: #009205;
  }
  i {
    font-size: 12.5px;
    color: #009205;
  }
}

.custom-label {
  input::placeholder {
    opacity: 1;
  }
}
</style>

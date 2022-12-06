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
        ورود به حساب کاربری
      </h6>

      <p
        class="text-muted text-custom text-nowrap"
        style="font-family: IRANSans"
      >
        پیامکی حاوی یک کد ۶ رقمی برای شما ارسال شد
      </p>

      <label class="floating-label custom-label">
        <input
          type="text"
          v-model="code.code"
          placeholder=""
          @blur="v$.code.$touch()"
        />
        <span
          :style="`${
            code.code
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
          احراز شماره همراه
        </span>
      </label>

      <p
        v-for="(error, index) in v$.code.$errors"
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
        @click="resendVerificationCode()"
        class="text-custom text text-nowrap text-center text-secondary hover-make-big"
        style="font-family: IRANSans; font-size: 0.75rem"
      >
        ارسال مجدد کد
      </p>

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

<script lang="ts">
import router from '@/router';
import { computed, defineComponent, reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import axios from 'axios';
import { store, useStudentStore } from '@/store';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import { StudentActionTypes } from '@/store/modules/student/action-types';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import { baseUrl } from '@/api/apiclient';
import alertify from '@/assets/alertifyjs/alertify';

export default defineComponent({
  props: {
    model: { type: String },
    token: { type: String, default: '' },
    whatToAuthenticate: { type: String, default: 'passwordChange' }
  },
  setup(props) {
    const model = ref();
    if (props.model) {
      store.commit(StudentMutationTypes.SET_AUTH_OBJECT, props.model);
      model.value = JSON.parse(props.model);
    } else {
      model.value = JSON.parse(useStudentStore().getters.getAuthObject as any);
    }

    const isSendingAMainReq = ref(false);

    const code = reactive({ code: '' });

    const sendToHome = async () => {
      v$.value.$touch();

      if (v$.value.$invalid) return false;

      isSendingAMainReq.value = true;

      if (props.whatToAuthenticate == 'signup') {
        try {
          let studentInstance = axios.create({
            baseURL: baseUrl,
            // 5 minutes
            timeout: 300000,
            headers: {}
          });
          studentInstance.interceptors.request.use((config) => {
            const token =
              props.token ||
              (useStudentStore().getters.getAuthObject as any).token;
            if (token) config.headers.token = `${token}`;
            return config;
          });
          studentInstance.interceptors.response.use(
            (response) => response,
            (error) => {
              // Any status codes that falls outside the range of 2xx cause this function to trigger
              // Do something with response errord

              isSendingAMainReq.value = false;
              if (
                error.response &&
                error.response.data &&
                error.response.data.message
              )
                alertify.error(error.response.data.message);
              return Promise.reject(error);
            }
          );
          studentInstance
            .post('auth/verificationcode', code, {
              headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
              }
            })
            .then(async (sendCode) => {
              isSendingAMainReq.value = false;

              if (
                sendCode.data.status == 0 ||
                sendCode.data.status == 200 ||
                sendCode.data.message == 'messages.verification.success'
              ) {
                // Set The Token If All Working
                store.commit(StudentMutationTypes.SET_TOKEN, props.token);
                // Change Current Student To Then Created One
                await store.dispatch(StudentActionTypes.CURRENT_STUDENT);
                router.push({ name: 'Home' });
              }
            });
        } catch (error) {
          isSendingAMainReq.value = false;
          alertify.error(error);
        }
      } else {
        isSendingAMainReq.value = true;

        try {
          const res = await StudentAuthServiceApi.activateCodeForgetPassword({
            username: model.value as string as string,
            code: code.code
          });
          isSendingAMainReq.value = false;
          if (res.data || res.data.status == 0 || res.data.status == 200) {
            router.push({
              name: 'StudentPasswordChange',
              params: { code: code.code }
            });
          }
        } catch (e) {
          isSendingAMainReq.value = false;
        }
      }
    };
    const sendToPasswordRecover = () =>
      router.push({
        name: 'StudentPasswordRecover',
        params: { phone: model.value.phone }
      });
    const cancel = () => {
      router.push({ name: 'StudentLogin' });
    };

    const mustBeValidCode = (value: string) => value.length === 6;

    const rules = computed(() => ({
      code: {
        required: helpers.withMessage(
          'لطفا کد ارسال شده را وارد کنید',
          required
        ),
        mustBeValidCode: helpers.withMessage(
          'کد وارد شده باید ۶ رقم باشد',
          mustBeValidCode
        )
      }
    }));
    const v$ = useVuelidate(rules, code);

    const resendVerificationCode = async () => {
      if (props.whatToAuthenticate == 'signup') {
        try {
          const res = await axios({
            method: 'post',
            url: `${baseUrl}auth/sendverificationcode`,
            headers: {
              token: props.token
            },
            data: {
              phone: model.value.phone || model.value
            }
          });
          alertify.success(res.data.message);
        } catch (e) {
          console.log(e);
        }
      } else {
        const res = await StudentAuthServiceApi.sendCodeForForgetPassword({
          username: model.value as string
        });
        alertify.success(res.data.message);
      }
    };

    return {
      cancel,
      code,
      v$,
      sendToHome,
      sendToPasswordRecover,
      resendVerificationCode,
      isSendingAMainReq
    };
  }
});
</script>
<style lang="scss" scoped>
.desktop {
  background: url('../../../assets/img/desktop-bg@2x.png') center center
    no-repeat;
  background-size: cover;
}
.Forget-the-password {
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
    // width: 175px;
    // height: 28px;
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

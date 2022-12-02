<template>
  <div class="desktop" v-if="!isMobile.value">
    <img src="@/assets/img/logo-mahan.png" alt="logo" />
    <div class="Login animate__animated animate__fadeIn">
      <div>
        <label class="floating-label">
          <input
            placeholder="نام کاربری"
            type="text"
            v-model="model.username"
            @blur="v$.username.$touch()"
          />
          <span>نام کاربری </span>
        </label>
        <p
          v-for="error in v$.username.$errors"
          class="text-danger text-bold m-2"
          :key="error.$uid"
          style="font-family: IRANSans; font-size: 12px"
        >
          {{ error.$message }}
        </p>

        <label class="floating-label">
          <input
            placeholder="رمز عبور"
            type="password"
            v-model="model.password"
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
            رمز عبور</span
          >
        </label>
        <p
          v-for="error in v$.password.$errors"
          class="text-danger text-bold m-2"
          :key="error.$uid"
          style="font-family: IRANSans; font-size: 12px"
        >
          {{ error.$message }}
        </p>

        <button @click="login" class="button-linear">
          <template v-if="isRequesting">
            <span
              style="width: 1.3rem; height: 1.3rem"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </template>

          <span v-else> ورود </span></button
        ><br />

        <span class="register hover-make-big" @click="moveToSignUp">
          ثبت نام در ماهان
        </span>
        <br />

        <span
          class="reset-password hover-make-big"
          @click="moveToPasswordRecover()"
        >
          فراموشی رمز عبور
        </span>
        <br />

        <a
          class="download-link hover-make-big mt-2"
          href="https://api.mahanplus.com/api/auth/app/app.apk"
          target="_blank"
        >
          دریافت اپلیکیشن اندروید
        </a>
        <br />

        <a
          class="download-link hover-make-big mt-2"
          href="https://sibche.com/applications/mahan-2"
          target="_blank"
        >
          دریافت اپلیکیشن IOS
        </a>
        <br />

        <a
          class="download-link hover-make-big mt-2"
          href="https://api.mahanplus.com/api/auth/app/SetupBrowser.msi"
          target="_blank"
        >
          دریافت اپلیکیشن شرکت در کلاس آنلاین ویندوز 10
        </a>
        <br />

        <a
          class="download-link hover-make-big mt-2"
          href="https://api.mahanplus.com/api/auth/app/SetupBrowserWin7.msi"
          target="_blank"
        >
          دریافت اپلیکیشن شرکت در کلاس آنلاین ویندوز 7
        </a>
      </div>
    </div>
    <img src="@/assets/img/mahan.png" alt="footer logo" />
  </div>

  <div class="mobile" v-else>
    <div class="imgs animate__animated animate__fadeIn">
      <img src="@/assets/img/bitmap.png" class="bitmap" alt="bitmap" />
      <img
        src="@/assets/img/logo-mahan.png"
        style="height: 50px; width: 225px"
        alt="logo"
      />
      <img src="@/assets/img/mahan.png" alt="footer logo" />
    </div>
    <div class="Login animate__animated animate__fadeIn">
      <div>
        <label class="floating-label">
          <input
            placeholder="نام کاربری"
            type="text"
            v-model="model.username"
            @blur="v$.username.$touch()"
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
          v-for="error in v$.username.$errors"
          class="text-danger text-bold m-2"
          :key="error.$uid"
          style="font-family: IRANSans; font-size: 12px"
        >
          {{ error.$message }}
        </p>

        <label class="floating-label">
          <input
            placeholder="رمز عبور"
            type="password"
            v-model="model.password"
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
            رمز عبور</span
          >
        </label>
        <p
          v-for="error in v$.password.$errors"
          class="text-danger text-bold m-2"
          :key="error.$uid"
          style="font-family: IRANSans; font-size: 12px"
        >
          {{ error.$message }}
        </p>

        <button @click="login" class="button-linear">
          <template v-if="isRequesting">
            <span
              style="width: 1.3rem; height: 1.3rem"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </template>

          <span v-else> ورود </span>
        </button>

        <br />
        <span class="registe hover-make-bigr" @click="moveToSignUp">
          ثبت نام در ماهان </span
        ><br />
        <span
          class="reset-password hover-make-big"
          @click="moveToPasswordRecover()"
        >
          فراموشی رمز عبور
        </span>
        <br />

        <a
          class="download-link hover-make-big mt-2"
          href="https://api.mahanplus.com/api/auth/app/app.apk"
          target="_blank"
        >
          دریافت اپلیکیشن اندروید
        </a>
        <br />

        <a
          class="download-link hover-make-big mt-2"
          href="https://sibche.com/applications/mahan-2"
          target="_blank"
        >
          دریافت اپلیکیشن IOS
        </a>
        <br />

        <a
          class="download-link hover-make-big mt-2"
          href="https://api.mahanplus.com/api/auth/app/SetupBrowser.msi"
          target="_blank"
        >
          دریافت اپلیکیشن شرکت در کلاس آنلاین ویندوز 10
        </a>
        <br />

        <a
          class="download-link hover-make-big mt-2"
          href="https://api.mahanplus.com/api/auth/app/SetupBrowserWin7.msi"
          target="_blank"
        >
          دریافت اپلیکیشن شرکت در کلاس آنلاین ویندوز 7
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { store } from '@/store';
import { StudentActionTypes } from '@/store/modules/student/action-types';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import { minLength, helpers, required } from '@vuelidate/validators';
import alertify from '@/assets/alertifyjs/alertify';

export default defineComponent({
  setup() {
    const isRequesting = ref(false);
    const windowHeight = ref(window.innerHeight);
    const model = reactive({
      username: '',
      password: ''
    } as any);

    const login = async () => {
      v$.value.$touch();

      if (!v$.value.$invalid) {
        isRequesting.value = true;

        try {
          const authCheck = await store.dispatch(
            StudentActionTypes.AUTH_REQUEST_STUDENT,
            model
          );
          isRequesting.value = false;

          if (authCheck) {
            await store.dispatch(StudentActionTypes.CURRENT_STUDENT);
            router.push({ name: 'Home' });
            alertify.success(' ورود با موفقیت انجام شد ');
          }
        } catch (e) {
          isRequesting.value = false;
        }
      }
    };

    const rules = computed(() => ({
      username: {
        required: helpers.withMessage(
          'لطفا نام کاربری خود را وارد کنید',
          required
        ),
        minLength: helpers.withMessage(
          'نام کاربری باید حداقل 6 رقم باشد',
          minLength(8)
        )
      },
      password: {
        required: helpers.withMessage('لطفا رمز خود را وارد کنید', required),
        minLength: helpers.withMessage(
          'رمز عبور باید حداقل 8 رقم باشد',
          minLength(8)
        )
      }
    }));

    const v$ = useVuelidate(rules, model);
    const moveToSignUp = () => {
      router.push({ name: 'StudentSignup' });
    };
    const moveToPasswordRecover = () => {
      router.push({ name: 'StudentPasswordRecover' });
    };

    const onResize = (): void => {
      windowHeight.value = window.innerHeight;
    };

    const getMainStyle = (): { height: string } => {
      return { height: `${windowHeight.value - 1}px` };
    };

    onMounted(() => {
      window.addEventListener('resize', onResize);
    });

    return {
      windowHeight,
      model,
      v$,
      moveToPasswordRecover,
      moveToSignUp,
      onResize,
      getMainStyle,
      login,
      isRequesting
    };
  }
});
</script>

<style lang="scss" scoped>
.desktop {
  width: 100%;
  height: 100%;
  background: url('../../../assets/img/desktop-bg@2x.png') center center
    no-repeat;
  background-size: cover;
  font-family: IRANSans;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img.logo-mahan {
    margin-top: 38px;
    width: 190px;
    height: 90px;
    object-fit: contain;
  }
  .register {
    width: 99px;
    height: 24px;
    margin-top: 87px;
    margin-bottom: 36px;
    font-size: 15px;
    letter-spacing: -2px;
    text-align: center;
    color: #171717;
  }

  .title {
    width: 175px;
    height: 28px;
    margin-top: 25px;
    font-size: 19px;
    font-weight: 500;
    letter-spacing: -2.09px;
    color: #fff;
  }
  .password {
    margin-top: 10px;
  }
  .username {
    margin-top: 39px;
  }
  .inputs {
    // width: 269px;
    // height: 51px;
    border-radius: 15px;
    background: #f6f8fa;
    border: 2px solid #ddd;
  }
  .login-btn {
    // width: 269px;
    // height: 51px;
    border-radius: 15px;
    background: rgb(241, 24, 24);
    border: none;
    span {
      width: 85px;
      height: 24px;
      font-size: 15.3px;
      font-weight: bold;
      color: #fff;
    }
  }
  .reset-password {
    margin-top: 16px;
    font-family: 'IRANSans';
    font-size: 13px;
    text-align: center;
    color: #ed1b24;
    cursor: pointer;
  }
  .download-link {
    margin-top: 16px;
    font-family: 'IRANSans';
    font-size: 13px;
    text-align: center;
    color: #3a1bed;
    cursor: pointer;
    text-decoration: none;
  }

  .Login {
    width: 100%;
    max-width: 400px;
    display: inline-block;
    text-align: center;
    margin: 1.5rem auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: fit-content;
    background: white;
    border-radius: 10px;
    cursor: pointer;

    div {
      width: 80%;
      margin: 1rem 0;
    }
    .register {
      font-size: 14px;
      font-weight: bold;
      color: #171717;
      text-align: center;
      margin: 0 0 1rem;
      padding: 0;
      display: inline-block;
      cursor: pointer;
    }
    .reset-password {
      color: #ed1b24;
      display: block;
      font-family: IRANSans;
      text-align: center;
      letter-spacing: -1.15px;
      text-align: center;
      margin: 0;
      cursor: pointer;
    }
    .download-link {
      margin-top: 16px;
      font-family: 'IRANSans';
      font-size: 13px;
      text-align: center;
      color: #3a1bed;
      cursor: pointer;
      text-decoration: none;
    }
  }
}
// Mobile
.mobile {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f6f8fa;
  background-color: white;

  overflow-y: scroll;
  overflow-x: hidden;
  .imgs {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    flex-basis: clamp(40%, 52.5%, 60%);
    position: relative;
    margin: 0;

    .bitmap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      object-fit: cover;
    }

    img {
      z-index: 2;
      &:nth-of-type(2) {
        position: absolute;
        margin: 1.5rem auto 1.5rem auto;
        top: 0;
      }
      &:nth-of-type(3) {
        position: absolute;
        margin: 1.5rem auto 1.5rem auto;
        bottom: 0;
      }
    }
  }
  .Login {
    width: 100%;
    display: inline-block;
    text-align: center;
    margin: 0;
    display: flex;
    justify-content: center;

    div {
      width: 80%;
      margin: 1rem 0;
    }
    .register {
      display: block;
      font-family: IRANSans;
      font-size: 14px;
      font-weight: bold;
      color: #171717;
      text-align: center;
      margin: 0;
      padding: 0;
    }
    .reset-password {
      color: #ed1b24;
      display: block;
      font-family: IRANSans;
      text-align: center;
      letter-spacing: -1.15px;
      text-align: center;
      margin: 0;
    }
    .download-link {
      margin-top: 16px;
      font-family: 'IRANSans';
      font-size: 13px;
      text-align: center;
      color: #3a1bed;
      cursor: pointer;
      text-decoration: none;
    }
  }
}
</style>

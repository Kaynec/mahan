<template>
  <div class="desktop" v-if="!mobile">
    <img alt="logo" src="@/assets/img/mahan-logo.png" />
    <!-- Main Part -->
    <form
      @submit.prevent="sendToStudentAuthentication()"
      class="Rectangle animate__animated animate__fadeIn"
    >
      <span class="Rectangle-header hover-make-big"> تغییر رمز عبور </span>

      <span class="Rectangle-label"> لطفا نام کاربری خود را وارد کنید </span>

      <label class="floating-label">
        <input
          v-model="model.username"
          placeholder="*********۰۹"
          @blur="v$.username.$touch()"
          type="text"
          id="name"
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
          نام کاربری</span
        >
      </label>
      <span
        v-for="(error, index) in v$.username.$errors"
        :key="index"
        class="text-danger text-bold"
        style="font-family: IRANSans"
      >
        {{ error.$message }}
      </span>

      <button class="button-linear">
        <span
          v-if="isSendingAMainReq"
          style="width: 1.3rem; height: 1.3rem"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span v-else> ارسال رمز عبور </span>
      </button>

      <span @click="cancel()" class="cancel hover-make-big">
        برگشت به صفحه ورود
      </span>
    </form>
    <img alt="logo" src="@/assets/img/mahan.png" />
  </div>

  <div class="Forget-the-password" v-else>
    <img alt="logo 2x" src="@/assets/img/mahan-logo.png" class="logo-mahan" />
    <!-- Main Part -->
    <form @submit.prevent="sendToStudentAuthentication()" class="Rectangle">
      <span class="Rectangle-header hover-make-big"> تغییر رمز عبور </span>

      <span class="Rectangle-label"> لطفا نام کاربری خود را وارد کنید </span>

      <label class="floating-label">
        <input
          v-model="model.username"
          placeholder="*********۰۹"
          @blur="v$.username.$touch()"
          type="text"
          id="name"
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
          نام کاربری</span
        >
      </label>
      <span
        v-for="(error, index) in v$.username.$errors"
        :key="index"
        class="text-danger text-bold"
        style="font-family: IRANSans"
      >
        {{ error.$message }}
      </span>

      <button class="button-linear">
        <span
          v-if="isSendingAMainReq"
          style="width: 1.3rem; height: 1.3rem"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span v-else> ارسال کد تایید </span>
      </button>

      <span @click="cancel()" class="cancel hover-make-big">
        برگشت به صفحه ورود
      </span>
    </form>
    <!--  -->
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { computed, defineComponent, reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { minLength, maxLength, required, helpers } from '@vuelidate/validators';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import alertify from '@/assets/alertifyjs/alertify';

export default defineComponent({
  setup() {
    const isSendingAMainReq = ref(false);

    const model = reactive({
      username: ''
    });

    const sendToStudentAuthentication = async () => {
      v$.value.$touch();

      if (!v$.value.$invalid) {
        isSendingAMainReq.value = true;

        try {
          const res = await StudentAuthServiceApi.sendCodeForForgetPassword({
            username: model.username
          });
          isSendingAMainReq.value = false;
          if (res.data) {
            alertify.success(res.data.message);
            router.push({
              name: 'StudentAuthentication',
              params: {
                model: JSON.stringify(model.username)
              }
            });
          }
        } catch (e) {
          console.error(e);
          isSendingAMainReq.value = false;
        }
      }
    };
    const cancel = () => {
      router.push({ name: 'StudentLogin' });
    };

    const rules = computed(() => ({
      username: {
        required: helpers.withMessage(
          'لطفا نام کاربری خود  را وارد کنید',
          required
        ),
        minLength: helpers.withMessage(
          'نام کاربری باید حداقل 5 حرف باشد',
          minLength(5)
        )
      }
    }));
    const v$ = useVuelidate(rules, model);
    return {
      cancel,
      model,
      v$,
      sendToStudentAuthentication,
      isSendingAMainReq
    };
  }
});
</script>
<style lang="scss" scoped>
.desktop {
  height: 100%;
  background: url('../../../assets/img/desktop-bg@2x.png') center center
    no-repeat;
  background-size: cover;
  font-family: IRANSans;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .Rectangle {
    max-width: 450px;
  }

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
    width: 269px;
    height: 51px;
    border-radius: 15px;
    background: #f6f8fa;
    border: 2px solid #ddd;
  }
  .login-btn {
    width: 269px;
    height: 51px;
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

  .Login {
    width: 100%;
    max-width: 350px;
    display: inline-block;
    text-align: center;
    margin: 1.5rem auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    max-height: 400px;
    background: white;
    border-radius: 10px;

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
  }
}

.Forget-the-password {
  width: 100%;
  height: 100%;
  background-color: #f6f8fa;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: IRANSans;
}

.Rectangle {
  width: 90%;
  max-width: 500px;
  padding: 26px 20px 14px 21px;
  border-radius: 10px;
  text-align: center;
  background: #ccc;
  margin: 2rem;
  text-align: center;
}
.Rectangle-header {
  margin: 1rem auto;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #171717;
}

.Rectangle-label {
  margin: 15px auto;
  display: block;
  font-size: 12px;
  letter-spacing: -0.2px;
  text-align: center;
  color: #000;
}
.cancel {
  font-size: 13px;
  letter-spacing: -2px;
  text-align: center;

  cursor: pointer;
  &:hover {
    transform: scale(1.08);
  }
}

img.logo-mahan {
  margin: 1rem auto;
  width: 80%;
  max-width: 420px;
  height: 90px;
  object-fit: contain;
}
</style>

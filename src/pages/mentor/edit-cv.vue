<template>
  <MentorDesktopHeader v-if="!mobile" />
  <div
    :class="`${mobile ? 'edit' : 'edit-pc'}`"
    :style="`padding-top : ${!mobile ? '3rem' : ''}`"
  >
    <MinimalHeader onePageBack="MentorProfile" title="رزومه" />
    <div class="wrapper animate__animated animate__fadeIn">
      <img :src="imageUrl" class="hero" v-if="mobile" />

      <div v-else class="img-btn">
        <img :src="imageUrl" />
        <button @click="submitCV()">ویرایش رزومه</button>
      </div>
      <!-- 
      <div class="textarea"> -->
      <textarea
        @input="v$.resume.$touch()"
        @blur="v$.resume.$touch()"
        v-model="model.resume"
      >
      </textarea>

      <p
        v-for="error in v$.resume.$errors"
        :key="error.id"
        style="margin: 1rem 0"
      >
        {{ error.$message }}
      </p>
      <button v-if="mobile" @click="submitCV()">ویرایش رزومه</button>
      <!-- </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, onUpdated } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { store } from '@/store';
import { helpers, minLength, required } from '@vuelidate/validators';
import { baseUrl } from '@/api/apiclient';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import MentorDesktopHeader from '@/modules/mentor-main/mentor-header.vue';
import { MentorAuthServiceApi } from '@/api/services/mentor/mentor-auth-service';

import router from '@/router';
import alertify from '@/assets/alertifyjs/alertify';
import { MentorActionTypes } from '@/store/modules/mentor/action-types';

export default defineComponent({
  // MentorDesktopHeader
  components: { MinimalHeader, MentorDesktopHeader },
  setup() {
    const model = reactive({
      resume: store.getters.getCurrentMentor.resume
    }) as any;

    let imageUrl =
      'data:image/jpeg;base64,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';
    if (
      store.getters.getCurrentMentor &&
      store.getters.getCurrentMentor.profileImage
    ) {
      imageUrl = `${baseUrl}mentor/getProfileImage/${store.getters.getCurrentMentor.profileImage}`;
    }

    onUpdated(() => {
      const el = document.querySelector('textarea')! as any;

      if (el) {
        el.height = el.scrollHeight + 'px';
      }
    });

    const rules = computed(() => ({
      resume: {
        required: helpers.withMessage('لطفا رزومه خود را وارد کنید', required),
        minLength: helpers.withMessage(
          'رزومه باید حداقل 10 حرف باشد',
          minLength(10)
        )
      }
    }));

    const submitCV = async () => {
      v$.value.$touch();

      if (!v$.value.$invalid) {
        const res = await MentorAuthServiceApi.editCv({
          resume: model.resume
        });

        if (res.data.data) {
          alertify.notify('رزومه شما با موفقیت ویرایش شد');
          router.push({ name: 'MentorProfile' });
          store.dispatch(MentorActionTypes.CURRENT_MENTOR);
        } else {
          alertify.error(
            'خطایی در فرآیند ویرایش رخ داد! لطفا دوباره امتحان کنید'
          );
          router.push({ name: 'MentorProfile' });
        }
      }
    };

    const v$ = useVuelidate(rules, model);

    return { v$, model, imageUrl, submitCV };
  }
});
</script>

<style lang="scss" scoped>
.edit {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .wrapper {
    overflow-y: auto;
    padding-bottom: 3rem;
    width: 100%;
    height: 100%;
    max-height: 96%;
    padding-bottom: 3rem;

    textarea {
      width: 100%;
      height: 100%;
      max-height: 48vh;
    }
  }

  .hero {
    width: 100%;
    max-height: 30vh;
    margin: 0 auto;
    object-fit: cover;
  }
}

p {
  color: red;
  font-size: 12px;
  font-weight: bold;
  margin: 0;
  margin-right: 1rem;
}

textarea {
  resize: none;
  border: 1px solid #e1bdba;
  border-radius: 20px;
  color: #646464;
  background: #fff;
  padding: 1rem;
}

button {
  background-color: red;
  color: #fff;
  border-radius: 10px;
  width: 90%;
  padding: 1rem 0;
  border: none;
  margin: 1rem auto 0;
  display: block;
}

.edit-pc {
  max-width: 1000px;

  height: 100%;
  overflow: hidden;

  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    .img-btn {
      width: 48%;
      margin: 0 1rem;

      img {
        width: 100%;
        object-fit: contain;
      }

      button {
        width: 100%;
      }
    }

    textarea {
      width: 100%;
      height: 100%;
      max-height: 650px;
      padding: 1rem;
    }
  }
}
</style>

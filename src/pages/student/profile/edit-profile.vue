<template>
  <!-- <div class="desktop" v-if="!mobile"></div> -->
  <!-- Spinner -->

  <div class="loader-parent" v-if="showThisWhileUplading">
    <div class="loading1"></div>
  </div>
  <!--  -->
  <div class="edit" v-else>
    <DesktopMinimalHeader v-if="!mobile" />
    <Header />
    <MinimalHeader title="ویرایش اطلاعات" goOnePageBack="MyProfile" />
    <div class="img-container animate__animated animate__fadeIn">
      <div class="img">
        <template v-if="imageIsBeingUploaded">
          <span
            style="width: 1.3rem; height: 1.3rem"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        </template>

        <template v-else-if="!imageIsBeingUploaded">
          <img
            class="animate__animated animate__fadeIn avatar"
            alt="avatar"
            :src="imageUrl"
          />

          <img
            src="@/assets/img/camera@2x.png"
            class="camera"
            alt="camera"
            @click="openCamera"
          />
        </template>

        <input
          type="file"
          accept="image/x-png,image/jpeg,image/gif,image/svg"
          style="display: none"
          ref="imgInput"
          name="image"
          @input="uploadImage"
        />
      </div>
      <br />

      <!-- Error For img -->
      <p
        v-for="error in v$.img.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>
      <!--  -->
    </div>
    <!-- Form -->
    <form @submit.prevent="onSubmit" class="animate__animated animate__fadeIn">
      <div class="input">
        <span style="white-space: nowrap; padding: 0"> نام کاربری </span>
        <input type="text" v-model="model.username" maxlength="20" disabled />
      </div>

      <!--  -->
      <div class="input">
        <span style="white-space: nowrap; padding: 0"> نام </span>
        <input
          type="text"
          @blur="v$.firstname.$touch()"
          v-model="model.firstname"
          maxlength="20"
        />
      </div>
      <p
        v-for="error in v$.firstname.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <!--  -->

      <div class="input">
        <span style="white-space: nowrap; padding: 0"> نام خانوادگی </span>
        <input
          type="text"
          @blur="v$.lastname.$touch()"
          v-model="model.lastname"
          maxlength="20"
        />
      </div>
      <p
        v-for="error in v$.lastname.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="select">
        <select @blur="v$.stateId.$touch()" v-model="model.stateId">
          <option v-for="state in states" :value="state.ID" :key="state.ID">
            {{ state.Title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.stateId.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="select">
        <select @blur="v$.cityId.$touch()" v-model="model.cityId">
          <option v-for="city in cities" :value="city.ID" :key="city.ID">
            {{ city.Title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.cityId.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="select custom">
        <span style="white-space: nowrap; padding: 0"> مقطع تحصیلی </span>
        <select @blur="v$.grade.$touch()" v-model="model.grade">
          <option
            v-for="grade in allGrades"
            :value="{ _id: grade._id }"
            :key="grade._id"
          >
            {{ grade.title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.grade.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="select custom">
        <span style="white-space: nowrap; padding: 0"> گروه تحصیلی </span>
        <select @blur="v$.group.$touch()" v-model="model.group">
          <option
            v-for="group in groups.groups"
            :value="{ _id: group._id }"
            :key="group._id"
          >
            {{ group.title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.group.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="select custom">
        <span style="white-space: nowrap; padding: 0"> فیلد تحصیلی </span>
        <select @blur="v$.field.$touch()" v-model="model.field">
          <option
            v-for="field in fields()"
            :value="{ _id: field._id }"
            :key="field._id"
          >
            {{ field.title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.field.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="select custom">
        <span style="white-space: nowrap; padding: 0"> گرایش تحصیلی </span>
        <select @blur="v$.orientation.$touch()" v-model="model.orientation">
          <option
            v-for="orientation in orientations()"
            :value="{ _id: orientation._id }"
            :key="orientation._id"
          >
            {{ orientation.title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.orientation.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <button
        type="submit"
        class="button-linear"
        style="padding: 1rem; color: #fff"
      >
        ثبت اطلاعات
      </button>
    </form>
    <!--  -->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers, maxLength } from '@vuelidate/validators';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import { StudentActionTypes } from '@/store/modules/student/action-types';
import { store } from '@/store';
import router from '@/router';
import { provinces } from '@/assets/provinces';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { StudentGradeApi } from '@/api/services/student/student-grade-service';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { baseUrl } from '@/api/apiclient';
import { resizeImage } from '@/utilities/get-image-from-url';
import alertify from '@/assets/alertifyjs/alertify';
import Header from '@/modules/student-modules/header/header.vue';

export default defineComponent({
  components: { MinimalHeader, DesktopMinimalHeader, Header },
  setup() {
    const showThisWhileUplading = ref(false);

    const goOnePageBack = () => router.go(-1);

    const imgInput = ref(null) as any;

    const imageIsBeingUploaded = ref(false);

    const currentUser = ref(store.getters.getCurrentStudent);

    const model = reactive({
      username: currentUser.value.username,

      firstname: currentUser.value.firstname,
      lastname: currentUser.value.lastname,
      stateId: currentUser.value.stateId,
      cityId: currentUser.value.cityId,
      grade: {
        _id: currentUser.value.grade._id
      },
      group: {
        _id: currentUser.value.group._id
      },
      field: {
        _id: currentUser.value.field._id
      },
      img: ''
    }) as any;

    currentUser.value?.orientation?._id &&
      (model.orientation = {
        _id: currentUser.value.orientation._id
      });

    const states = ref([] as any);
    const allGrades = reactive([] as any);

    StudentGradeApi.getAll().then((res) => {
      res.data.data.forEach((grade: any) => {
        allGrades.push(grade);
      });
    });

    StudentAuthServiceApi.getAllStates().then((res) => {
      states.value = res.data.data;
    });

    const cities = computed(() => {
      return (
        states.value.find((el) => {
          return el.ID === model.stateId;
        })?.CityList || []
      );
    });

    const groups = computed(() => {
      return (
        allGrades.find((el) => {
          return el._id === model.grade._id;
        }) || []
      );
    });

    const fields = () => {
      if (groups.value && groups.value.groups) {
        return groups.value.groups.find((el) => {
          return el._id === model.group._id;
        })?.fields;
      }
    };

    const orientations = () => {
      if (fields()) {
        return fields().find((el) => {
          return el._id === model.field._id;
        })?.orientations;
      }
    };

    const imageUrl = ref(
      'data:image/jpeg;base64,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'
    ) as any;
    if (
      store.getters.getCurrentStudent &&
      store.getters.getCurrentStudent.profileImage
    ) {
      imageUrl.value = `${baseUrl}student/getProfileImage/${store.getters.getCurrentStudent.profileImage}`;
    }

    // limit for pic is 10 Mb
    const limitSize = (value) => !helpers.req(value) || value.size < 10485760;

    const rules = computed(() => ({
      firstname: {
        required: helpers.withMessage('لطفا نام خود را وارد کنید', required),
        minLength: helpers.withMessage(
          'نام باید حداقل ۳ رقم باشد',
          minLength(3)
        )
      },
      lastname: {
        required: helpers.withMessage(
          'لطفا نام خانوادگی خود را وارد کنید',
          required
        ),
        minLength: helpers.withMessage(
          'نام خانوادگی  باید حداقل ۳ رقم باشد',
          minLength(3)
        )
      },
      stateId: {
        required: helpers.withMessage('لطفا  استان خود را وارد کنید', required)
      },
      cityId: {
        required: helpers.withMessage('لطفا شهر  خود را وارد کنید', required)
      },
      grade: {
        required: helpers.withMessage(
          'لطفا مقطع تحصیلی خود را وارد کنید',
          required
        )
      },
      group: {
        required: helpers.withMessage(
          'لطفا گروه تحصیلی خود را وارد کنید',
          required
        )
      },
      field: {
        required: helpers.withMessage(
          'لطفا زمینه تحصیلی خود را وارد کنید',
          required
        )
      },
      orientation: {
        required: helpers.withMessage(
          'لطفا گرایش تحصیلی خود را وارد کنید',
          required
        )
      },
      img: {
        limitSize: helpers.withMessage(
          'حجم تصویر باید کمتر از 10 مگابایت باشد',
          limitSize
        )
      }
    }));

    const onSubmit = async () => {
      v$.value.$touch();
      // If Something isn't filled return
      if (v$.value.$invalid) return;
      else {
        showThisWhileUplading.value = true;

        const { img, ...restOfModel } = model as any;
        delete restOfModel.username;
        const temp = new FormData();

        try {
          const userEditedInfo = (await StudentAuthServiceApi.editStudent(
            restOfModel
          )) as any;

          // if user selected a img
          if (img != '') {
            temp.append('profile', img);
            await StudentAuthServiceApi.uploadProfile(temp);
          }

          // If The res is okay
          if (userEditedInfo.data) {
            await store.dispatch(StudentActionTypes.CURRENT_STUDENT);
            showThisWhileUplading.value = false;
            // / Update The Current user
            alertify.success('کاربر با موفقیت ویرایش شد');
            router.push({ name: 'MyProfile' });
          }
        } catch (e) {
          showThisWhileUplading.value = false;
        }
      }
    };

    const v$ = useVuelidate(rules, model);
    // Open The Gallery On Click
    const openCamera = () => imgInput.value.click();
    // assign The File to a variable

    const uploadImage = async () => {
      imageIsBeingUploaded.value = true;
      model.img = await imgInput.value.files[0];
      const config = {
        file: model.img,
        maxSize: 500
      };
      const resizedImage = (await resizeImage(config)) as any;

      imageIsBeingUploaded.value = false;

      imageUrl.value = resizedImage.base64;

      model.img = resizedImage.blob;
    };

    return {
      v$,
      onSubmit,
      model,
      goOnePageBack,
      provinces,
      imgInput,
      openCamera,
      uploadImage,
      StudentAuthServiceApi,
      store,
      showThisWhileUplading,
      imageUrl,
      states,
      cities,
      groups,
      fields,
      orientations,
      allGrades,
      imageIsBeingUploaded
    };
  }
});
</script>

<style lang="scss" scoped>
.edit {
  width: 100%;
  background-color: #f4f4f4;
  font-family: IRANSans;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  max-width: 1000px;

  // padding-top: 8vh;
  .img-container {
    width: 100%;
    margin: 3rem auto 1rem auto;
    display: flex;
    justify-content: center;
    .img {
      position: relative;
      border: 0.4rem solid #669bbc;
      border-radius: 50px;
    }
    .camera {
      position: absolute;
      bottom: 0;
      margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;
      background: #669bbc;
      border-radius: 15px;
      padding: 2px;
      width: 32.5px;
      height: 32.5px;
      transform: translateY(50%);
    }
    .avatar {
      position: relative;
      width: 6rem;
      height: 6rem;
      border-radius: 50px;
      border: solid 4.4px white;
    }
  }

  form {
    width: 80%;
    max-width: 500px;
    margin: 2rem auto 1rem auto;

    .input {
      width: 100%;
      border-radius: 10px;
      background-color: #fff;
      margin: 1rem 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-areas: 'span input input';
      align-items: center;
      padding: 0.5rem;
      span {
        display: inline-block;
        text-align: right;
        color: #949494;
        font-size: 10px;
        grid-area: Span;
        min-width: 5rem;
      }

      input {
        border: none;
        outline: none;
        padding-right: 0.5rem;
        grid-area: input;
      }
    }

    .radio {
      display: flex;
      align-items: center;

      input {
        margin-right: 1rem;
        margin-left: 1rem;
      }
    }

    .select {
      width: 100%;
      border-radius: 10px;
      background-color: #fff;
      margin: 1rem 0;
      padding: 0.5rem;

      span {
        font-size: 9px;
      }

      select {
        border: none;
        outline: none;
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: #949494;
        background: transparent;
      }

      option {
        font-size: 14px;
      }
    }

    .custom {
      span {
        color: #949494;
      }

      select {
        color: #333;
        -webkit-appearance: none;
        -moz-appearance: none;
      }
    }

    .custom select::-ms-expand {
      display: none;
    }
  }
}
</style>

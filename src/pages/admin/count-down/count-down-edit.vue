<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.title}` : 'تعریف کانت داون جدید' }}
    </h2>
    <form @submit.prevent="save" class="mt-5">
      <div class="form-row">
        <div class="form-group col-md-5 flex col-sm-12 center-block">
          <label for="title">عنوان :</label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="model.title"
            @blur="v$.title.$touch()"
          />
          <span
            v-for="error in v$.title.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
        <div class="form-group col-md-5 col-sm-12">
          <label for="code"> متن:</label>

          <textarea
            class="form-control"
            @blur="v$.description.$touch()"
            v-model="model.description"
          >
          </textarea>
          <span
            v-for="error in v$.description.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-5 col-sm-12">
          <label> عدد شمارش :</label>
          <input
            type="number"
            class="form-control"
            id="countNumber"
            v-model="model.countNumber"
            @blur="v$.countNumber.$touch()"
          />
          <!--  -->
          <span
            v-for="error in v$.countNumber.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->

        <div class="form-group col-md-5 col-sm-12">
          <label> مقطع تحصیلی :</label>
          <select
            class="form-select"
            v-model="model.grade"
            @blur="v$.grade.$touch()"
          >
            <option
              :value="{
                _id: grade._id
              }"
              v-for="grade in grades"
            >
              {{ grade.title }}
            </option>
          </select>
          <!--  -->
          <span
            v-for="error in v$.grade.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
      </div>
      <button class="btn btn-default ml-3 mt-4" @click="cancel()">برگشت</button>
      <button type="submit" class="btn btn-default mt-4">ذخیره</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import { helpers, minLength, required } from '@vuelidate/validators';
import alertify from '@/assets/alertifyjs/alertify';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
import { CountDownServiceApi } from '@/api/services/admin/count-down-service';

const props = defineProps({
  countDown: {
    type: String,
    default: '{}'
  }
});

let model = reactive<{
  title: string;
  description: string;
  countNumber: number;
  grade: {
    _id: string;
  };
  _id?: number;
}>(JSON.parse(props.countDown));

// It Comes As A Id Initially
model.grade && (model.grade = { _id: model.grade });

// All The Questions And Courses
let grades = ref([] as any);

/////////////
GradeServiceApi.getAll().then((res) => {
  res.data.data.forEach((data: any) => {
    grades.value.push(data);
  });
});

model =
  JSON.stringify(model) === '{}'
    ? reactive({
        title: '',
        description: '',
        countNumber: 0,
        grade: {
          _id: ''
        }
      })
    : model;

const save = () => {
  /// error handeling
  v$.value.$touch();
  if (!v$.value.$invalid) {
    let tmp: any = {
      title: model.title,
      description: model.description,
      countNumber: model.countNumber,
      grade: model.grade
    };
    if (model._id) {
      CountDownServiceApi.update(model._id, tmp).then((result) => {
        alertify.success(result.data.message);
        router.push({
          name: 'count-down'
        });
      });
    } else {
      CountDownServiceApi.create(tmp).then((result) => {
        alertify.success(result.data.message);
        router.push({
          name: 'count-down'
        });
      });
    }
  }
};

// Validations
const rules = computed(() => ({
  title: {
    required: helpers.withMessage('عتوان  را وارد کنید', required),
    minLength: helpers.withMessage('عتوان باید حدقا 3 حرف باشد', minLength(3))
  },
  description: {
    required: helpers.withMessage('متن  ضروری است', required),
    minLength: helpers.withMessage('متن باید حداقل 3 حرف باشد', minLength(3))
  },
  countNumber: {
    required: helpers.withMessage(' عدد کانت داون  ضروری است', required)
  },
  grade: {
    required: helpers.withMessage('مقطع  ضروری است', required)
  }
}));

const v$ = useVuelidate(rules, model);
// cancel //
const cancel = () => {
  router.push({
    name: 'count-down'
  });
  alertify.notify('cancelled action');
};
</script>

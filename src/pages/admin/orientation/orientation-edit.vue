<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.title}` : 'تعریف گرایش جدید' }}
    </h2>
    <form @submit.prevent="save" class="mt-5">
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12" v-if="!model._id">
          <label> مقطع </label>
          <select
            v-model="currentGrade"
            class="form-select"
            aria-label="مقطع را انتخاب کنید "
            placeholder="مقطع را انتخاب کنید"
          >
            <option
              v-for="grade in grades"
              :key="grade.title"
              @blur="v$.grade.$touch()"
              :value="grade._id"
            >
              {{ grade.title }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-4 col-sm-12" v-if="!model._id">
          <label> گروه </label>
          <select
            v-model="currentGroup"
            class="form-select"
            aria-label="مقطع را انتخاب کنید "
            placeholder="مقطع را انتخاب کنید"
          >
            <option
              v-for="group in filteredGroups"
              :key="group.title"
              @blur="v$.group.$touch()"
              :value="group._id"
            >
              {{ group.title }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-4 col-sm-12" v-if="!model._id">
          <label> رشته </label>
          <select
            v-model="currentField"
            class="form-select"
            aria-label="مقطع را انتخاب کنید "
            placeholder="مقطع را انتخاب کنید"
          >
            <option
              v-for="field in filteredFields"
              :key="field.title"
              @blur="v$.field.$touch()"
              :value="field._id"
            >
              {{ field.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12">
          <label for="username">نام گرایش:</label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="model.title"
          />
          <span
            v-for="error in v$.title.$errors"
            :key="error"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="code">کد گرایش:</label>
          <input
            type="code"
            class="form-control"
            id="code"
            v-model="model.code"
          />
          <span
            v-for="error in v$.code.$errors"
            :key="error"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
      </div>
      <button class="btn btn-secondary ml-3 mt-4" @click="cancel()">
        برگشت
      </button>
      <button type="submit" class="btn btn-primary mt-4">ذخیره</button>
    </form>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.css';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.js';
import router from '@/router';
import { OrientationServiceApi } from '@/api/services/admin/orientation-service';
import useVuelidate from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
import { useRoute } from 'vue-router';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
import { baseUrl } from '@/api/apiclient';
import { jsonToFormData } from '@/api/helper';
//
import alertify from "@/assets/alertifyjs/alertify"

export default defineComponent({
  setup() {
    const route = useRoute();
    // This decides if model should be the same thing or re created
    let model = ref({
      title: '',
      code: '',
      ratios: []
    } as any);
    let grades = ref([] as any);
    let currentGrade = ref(route.params.gradeId || '');
    let currentGroup = ref(route.params.groupId || '');
    let currentField = ref(route.params.fieldId || '');

    let filteredGroups = computed(() => {
      if (currentGrade.value) {
        let result = grades.value.find(
          (p) => `${p._id}` == `${currentGrade.value}`
        );
        if (result) return result.groups;
        else return [];
      } else {
        return [];
      }
    });

    let filteredFields = computed(() => {
      if (currentGroup.value) {
        let result = filteredGroups.value.find(
          (p) => `${p._id}` == `${currentGroup.value}`
        );
        if (result) return result.fields;
        else return [];
      } else {
        return [];
      }
    });

    GradeServiceApi.getAll().then((res) => {
      res.data.data.forEach((data: any) => {
        grades.value.push(data);
      });
    });

    // getting data from the database
    if (route.params.orientationId) {
      OrientationServiceApi.get(route.params.orientationId as string).then(
        (result) => {
          let data = result.data.data;
          model.value._id = data._id;
          model.value.title = data.title;
          model.value.code = data.code;
        }
      );
    }
    //
    const save = () => {
      v$.value.$touch();
      if (!v$.value.$invalid) {
        // if user has an id update it with the current model otherwise create one
        let tmp = {
          title: model.value.title,
          code: model.value.code
        } as any;
        if (model.value._id) {
          OrientationServiceApi.update(model.value._id, tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'orientation',
              params: route.params
            });
          });
        } else {
          tmp.fieldId = currentField.value;
          OrientationServiceApi.create(tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'orientation',
              params: route.params
            });
          });
        }
      }
    };
    // cancel
    const cancel = () => {
      router.push({
        name: 'orientation',
        params: route.params
      });
    };

    const rules = computed(() => ({
      title: {
        required: helpers.withMessage('اسم نباید خالی باشد', required),
        minLength: helpers.withMessage(
          'اسم باید بیشتر از 2 حرف باشد ',
          minLength(2)
        )
      },
      code: {
        required: helpers.withMessage('کد نباید خالی باشد', required)
      }
    }));

    const v$ = useVuelidate(rules, model);

    return {
      model,
      save,
      cancel,
      v$,
      currentGrade,
      currentGroup,
      currentField,
      filteredGroups,
      filteredFields,
      grades
    };
  }
});
</script>

<style scoped lang="scss">
.customDiv {
  width: 50;
  margin: 0 auto;
  wordwrap: wrap;
}
.tag {
  margin: 0.5rem;
  font-weight: 600;
}
</style>

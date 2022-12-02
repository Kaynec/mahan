<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.title}` : 'تعریف پیام ساعت دار جدید' }}
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
          <label>ساعت شروع :</label>
          <select
            class="form-select"
            v-model="model.startTime"
            @blur="v$.startTime.$touch()"
          >
            <option value="00.00">00:00</option>
            <option value="00:30">00:30</option>
            <template v-for="number in 23" :key="number">
              <option
                :value="
                  number < 10
                    ? (number1 = `0${number}:00`)
                    : (number1 = `${number}:00`)
                "
              >
                {{ number1 }}
              </option>
              <option
                :value="
                  number < 10
                    ? (number2 = '0' + number + ':' + '30')
                    : (number2 = number + ':' + '30')
                "
              >
                {{ number2 }}
              </option>
            </template>
          </select>
          <!--  -->
          <span
            v-for="error in v$.startTime.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->

        <div class="form-group col-md-5 col-sm-12">
          <label>ساعت پایان :</label>
          <select
            class="form-select"
            v-model="model.endTime"
            @blur="v$.endTime.$touch()"
          >
            <option value="00.00">00:00</option>
            <option value="00:30">00:30</option>
            <template v-for="number in 23" :key="number">
              <option
                :value="
                  number < 10
                    ? (number1 = `0${number}:00`)
                    : (number1 = `${number}:00`)
                "
              >
                {{ number1 }}
              </option>
              <option
                :value="
                  number < 10
                    ? (number2 = '0' + number + ':' + '30')
                    : (number2 = number + ':' + '30')
                "
              >
                {{ number2 }}
              </option>
            </template>
          </select>
          <!--  -->
          <span
            v-for="error in v$.endTime.$errors"
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
import { computed, defineComponent, reactive } from 'vue';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import { helpers, minLength, required } from '@vuelidate/validators';
import { ScheduledMessageServiceApi } from '@/api/services/admin/scheduled-message-service';
import alertify from '@/assets/alertifyjs/alertify';

const props = defineProps({
  scheduledMessage: {
    type: String,
    default: '{}'
  }
});

let model = reactive<{
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  _id?: number;
}>(JSON.parse(props.scheduledMessage));

model =
  JSON.stringify(model) === '{}'
    ? reactive({
        title: '',
        description: '',
        startTime: '',
        endTime: ''
      })
    : model;

const save = () => {
  /// error handeling
  v$.value.$touch();
  if (!v$.value.$invalid) {
    let tmp: any = {
      title: model.title,
      description: model.description,
      startTime: model.startTime,
      endTime: model.endTime
    };
    if (model._id) {
      ScheduledMessageServiceApi.update(model._id, tmp).then((result) => {
        alertify.success(result.data.message);
        router.push({
          name: 'scheduled-message'
        });
      });
    } else {
      ScheduledMessageServiceApi.create(tmp).then((result) => {
        alertify.success(result.data.message);
        router.push({
          name: 'scheduled-message'
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
  startTime: {
    required: helpers.withMessage('زمان شروغ  ضروری است', required),
    minLength: helpers.withMessage('متن باید حداقل 3 حرف باشد', minLength(4))
  },
  endTime: {
    required: helpers.withMessage('زمان پایان  ضروری است', required),
    minLength: helpers.withMessage('متن باید حداقل 3 حرف باشد', minLength(4))
  }
}));

const v$ = useVuelidate(rules, model);
// cancel //
const cancel = () => {
  router.push({
    name: 'scheduled-message'
  });
  alertify.notify('cancelled action');
};
</script>

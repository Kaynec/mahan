<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.title}` : 'تعریف باندل جدید' }}
    </h2>
    <form @submit.prevent="save" class="mt-5">
      <div class="form-row">
        <div class="form-group col-md-3 col-sm-12">
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
              :value="grade._id"
            >
              {{ grade.title }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-3 col-sm-12">
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
              :value="group._id"
            >
              {{ group.title }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-3 col-sm-12">
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
              :value="field._id"
            >
              {{ field.title }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-3 col-sm-12">
          <label> گرایش </label>
          <select
            v-model="currentOrientation"
            class="form-select"
            aria-label="گرایش را انتخاب کنید "
            placeholder="گرایش را انتخاب کنید"
          >
            <option
              v-for="orientation in filteredOrientation"
              :key="orientation.title"
              :value="orientation._id"
            >
              {{ orientation.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6 col-sm-12">
          <label for="title">نام باندل:</label>
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
        <div class="form-group col-md-6 col-sm-12">
          <label for="title">توضیحات :</label>
          <input
            type="text"
            class="form-control"
            id="description"
            v-model="model.description"
          />
        </div>
      </div>
      <div class="form-group col-md-5 col-sm-12 mt-4">
        <label for="newBundle">نمایش در جدیدترین ها :</label>
        <input
          type="checkbox"
          class="mr-2"
          id="newBundle"
          v-model="model.newBundle"
        />
        <br />
      </div>
      <!--  -->
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12">
          <label for="price">قیمت :</label>
          <input
            type="number"
            class="form-control"
            id="price"
            v-model="model.price"
            @blur="v$.price.$touch()"
          />
          <br />
          <h6>قیمت ها به تومان هست</h6>
          <br />

          <span
            v-for="error in v$.price.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>

        <!-- Items -->
        <div class="form-group col-md-8 col-sm-12 bg-red! products-wrapper">
          <div class="search-container">
            <span> محصولات باندل: </span>
            <div class="search">
              <input type="text" v-model="search" placeholder="جستجو" />
            </div>
          </div>
          <div class="table-container">
            <div class="table-head">
              <div>
                عنوان محصول
                <el-checkbox
                  v-model="allActive"
                  @change="change"
                  size="large"
                />
              </div>

              <div>نوع محصول</div>
              <div>قیمت</div>
              <!-- <div>قیمت ویژه</div> -->
            </div>
            <div class="table-row" v-for="item in filteredData">
              <div>
                <el-checkbox size="large" v-model="item.selected" />
                {{ item.title }}
              </div>

              <div>{{ item.category }}</div>
              <div>{{ item.price }}</div>
              <!-- <div>قیمت ویژه</div> -->
            </div>
          </div>
        </div>
        <!--  -->
      </div>

      <!--  -->
      <div class="form-row files">
        <div v-if="!model._id" class="form-group col-md-5 col-sm-12">
          <label> فایل کاور </label>
          <input
            name="coverImage"
            type="file"
            @change="changeFile($event, 'coverImage')"
            @blur="v$.coverImage.$touch()"
          />
          <span
            v-for="error in v$.coverImage.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
      </div>

      <button class="btn btn-secondary ml-3 mt-4" @click="cancel()">
        برگشت
      </button>
      <button category="submit" class="btn btn-primary mt-4">ذخیره</button>
    </form>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, onBeforeMount, watch, watchEffect } from 'vue';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import {
  helpers,
  minLength,
  required,
  requiredIf
} from '@vuelidate/validators';
import { useRoute } from 'vue-router';
import alertify from '@/assets/alertifyjs/alertify';
import { BundleServiceApi } from '@/api/services/admin/bundle-service';
import { StoreServiceApi } from '@/api/services/admin/store-service';
import { useFuse } from '@vueuse/integrations/useFuse';
import { ElCheckbox } from 'element-plus';

const route = useRoute();
let model = ref<{
  [index: string]: any;
}>({});

let grades = ref([] as any);
let currentGrade = ref('');
let currentGroup = ref('');
let currentField = ref('');
let currentOrientation = ref('');
// getting data from the database

const allProdocts = ref<any[]>([]);

const results = ref<any[]>([]);

const options = computed(() => ({
  fuseOptions: {
    keys: ['price', 'title'],
    useExtendedSearch: true
  },
  matchAllWhenSearchEmpty: true
}));

let search = ref('');

watch(search, () => {
  results.value = useFuse(search, allProdocts, options).results.value;
});

const allActive = ref(true);

function change() {
  console.log('TOGGLE', allActive.value);
  allProdocts.value.forEach((item) => {
    if (allActive.value) item.selected = true;
    else item.selected = false;
  });
}

let filteredData = computed(() => {
  return results.value.map((el) => el.item);
});

onBeforeMount(async () => {
  const res = await StoreServiceApi.getAll();
  allProdocts.value = res.data.data;
  results.value = useFuse(search, allProdocts, options).results.value;
  //
  if (route.params.productId) {
    const result = await BundleServiceApi.get(route.params.productId as string);

    let data = result.data.data;
    model.value = data;
    currentGrade.value = data.grade;
    currentGroup.value = data.group;
    currentField.value = data.field;
    currentOrientation.value = data.orientation;

    // Set ALl To False But Change The ones we have
    allProdocts.value.map((prod) => (prod.selected = false));

    //
    model.value.products.forEach((el) => {
      const item = allProdocts.value.findIndex((item) => item._id === el._id);
      allProdocts.value[item].selected = true;
    });

    allProdocts.value.forEach((item) => {
      if (!item.selected) allActive.value = false;
    });
  }
});

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

let filteredOrientation = computed(() => {
  if (currentField.value) {
    let result = filteredFields.value.find(
      (p) => `${p._id}` == `${currentField.value}`
    );
    if (result) return result.orientations;
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

// validation
const rules = computed(() => ({
  title: {
    required: helpers.withMessage('عنوان ضروری است', required),
    minLength: helpers.withMessage(
      'عنوان باید بیشتر از 2 جرف باشد',
      minLength(2)
    )
  },
  price: { required: helpers.withMessage('قیمت ضروری است', required) },

  coverImage: {
    required: helpers.withMessage(
      'فایل کاور باندل ضروری است',
      requiredIf(() => {
        return !model.value._id;
      })
    )
  }
}));

const v$ = useVuelidate(rules, model);

// Handle The File
const changeFile = async (e: any, description: string) => {
  const file = await e.target.files[0];
  model.value[description] = await file;
  // if (description == 'demo') model.demo = await file;
  // else if (description == 'original') model.original = await file;
};

// Saving The File
const save = () => {
  v$.value.$touch();
  console.log(v$.value.$errors);
  //

  if (v$.value.$invalid) return;
  const temp: any = new FormData();

  temp.append('title', model.value.title);
  temp.append('price', model.value.price);
  temp.append('description', model.value.description);
  temp.append('grade[_id]', currentGrade.value);
  temp.append('group[_id]', currentGroup.value);
  temp.append('field[_id]', currentField.value);
  temp.append('orientation[_id]', currentOrientation.value);
  temp.append('newBundle', !!model.value.newBundle);

  allProdocts.value.forEach((prod, idx) => {
    if (!!prod.selected) {
      temp.append(`products[${idx}][_id]`, prod._id);
    }
  });

  for (let key in model.value) {
    if (
      typeof model.value[key] === 'object' &&
      key != 'demo' &&
      key != 'original' &&
      key != 'coverImage' &&
      key != 'category'
    ) {
      for (let subKey in model.value[key]) {
        temp.append(`${key}[${subKey}]`, model.value[key][subKey]);
      }
    }
  }

  //
  if (model.value._id) {
    const tmp = {
      title: model.value.title,
      price: model.value.price,
      description: model.value.description,
      newBundle: !!model.value.newBundle,
      grade: {
        _id: currentGrade.value
      },
      group: {
        _id: currentGroup.value
      },
      field: {
        _id: currentField.value
      },
      orientation: {
        _id: currentOrientation.value
      },
      products: allProdocts.value
        .filter((el) => el.selected)
        .map((el) => ({ _id: el._id }))
    } as any;
    BundleServiceApi.update(model.value._id, tmp).then((result) => {
      alertify.success(result.data.message);
      router.push({
        name: 'bundle'
      });
    });
  } else {
    model.value.coverImage && temp.append('coverImage', model.value.coverImage);
    BundleServiceApi.create(temp).then((result) => {
      alertify.success(result.data.message);
      router.push({
        name: 'bundle'
      });
    });
  }
};
//
const cancel = () => {
  router.push({
    name: 'bundle'
  });
  alertify.notify('cancelled action');
};
</script>
<style scoped lang="scss">
.files {
  margin: 2rem 5rem 1rem 0;
}
h6 {
  font-size: smaller;
  color: rgb(136, 133, 133);
}
.products-wrapper {
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-container {
  display: flex;
  align-items: center;

  width: 100%;
}

.search {
  flex-grow: 1;
  padding: 0 1rem;

  input {
    border-radius: 0.5rem;
    outline: none;
    border: 1px solid gray;
    padding: 0.5rem;
    width: 100%;
  }
}

.table-container {
  max-height: 400px;
  overflow: auto;
  position: relative;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background-color: #a3a3a3;
  color: #ffffff;
  // padding: 1rem;
  div {
    padding: 1rem;
  }
}

.table-head {
  position: sticky;
  top: 0;
}

.table-row {
  background-color: #cfcfcf;
  background-color: #f2f2f2;
  div {
    border: 1px solid #a3a3a3;
    height: full;
    color: #828282;

    &:first-child {
      display: flex;
      justify-content: flex-start;
      gap: 0.3rem;
    }
  }
}
</style>

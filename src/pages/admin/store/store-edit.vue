<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.title}` : 'تعریف محصول جدید' }}
    </h2>
    <form @submit.prevent="save" class="mt-5">
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12">
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
        <div class="form-group col-md-4 col-sm-12">
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
        <div class="form-group col-md-4 col-sm-12">
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
        <div class="form-group col-md-4 col-sm-12">
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
        <div class="form-group col-md-5 col-sm-12">
          <label for="title">نام محصول:</label>
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
          <label for="title">توضیحات :</label>
          <input
            type="text"
            class="form-control"
            id="description"
            v-model="model.description"
          />
        </div>
        <!--  -->
        <div class="form-group col-md-5 col-sm-12">
          <label for="title">نوع محصول:</label>
          <select v-model="model.category" class="form-select">
            <option
              v-for="category in allCategories"
              :key="category._id"
              :value="category"
            >
              {{ category.title }}
            </option>
          </select>
          <span
            v-for="error in v$.category.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <div class="form-group col-md-5 col-sm-12 mt-4">
          <label for="newProduct">نمایش در جدیدترین ها :</label>
          <input
            type="checkbox"
            class="mr-2"
            id="newProduct"
            v-model="model.newProduct"
            @blur="v$.newProduct.$touch()"
          />
          <br />
        </div>
        <!--  -->
      </div>

      <!--  -->

      <div class="form-row">
        <div class="form-group col-md-5 col-sm-12">
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

        <div class="form-group col-md-5 col-sm-12">
          <label for="specialPrice">قیمت ویژه:</label>
          <input
            type="number"
            class="form-control"
            id="specialPrice"
            v-model="model.specialPrice"
            @blur="v$.specialPrice.$touch()"
          />
          <span
            v-for="error in v$.specialPrice.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
      </div>

      <!--  -->
      <div class="form-row files">
        <div v-if="!model._id" class="form-group col-md-5 col-sm-12">
          <label> پیش نمایش</label>
          <input
            name="demo"
            @change="changeFile($event, 'demo')"
            type="file"
            @blur="v$.demo.$touch()"
          />
          <span
            v-for="error in v$.demo.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
        <div v-if="!model._id" class="form-group col-md-5 col-sm-12">
          <label> فایل اصلی</label>
          <input
            name="original"
            type="file"
            @change="changeFile($event, 'original')"
            @blur="v$.original.$touch()"
          />
          <span
            v-for="error in v$.original.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
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
<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { StoreServiceApi } from '@/api/services/admin/store-service';
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
export default defineComponent({
  setup() {
    const route = useRoute();
    let model = ref({} as any);

    let grades = ref([] as any);
    let currentGrade = ref('');
    let currentGroup = ref('');
    let currentField = ref('');
    let currentOrientation = ref('');
    // getting data from the database
    if (route.params.productId) {
      const result = StoreServiceApi.get(route.params.productId as string).then(
        (result) => {
          let data = result.data.data;
          model.value = data;
          currentGrade.value = data.grade;
          currentGroup.value = data.group;
          currentField.value = data.field;
          currentOrientation.value = data.orientation;
        }
      );
    }
    const allCategories = ref([]);

    StoreServiceApi.getAllCategories().then((res) => {
      allCategories.value = res.data?.data;
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
      category: {
        required: helpers.withMessage('نوع محصول ضروری است', required)
      },
      title: {
        required: helpers.withMessage('عنوان ضروری است', required),
        minLength: helpers.withMessage(
          'عنوان باید بیشتر از 2 جرف باشد',
          minLength(2)
        )
      },
      price: { required: helpers.withMessage('قیمت ضروری است', required) },
      specialPrice: {},
      demo: {
        required: helpers.withMessage(
          'فایل اصلی ضروری است',
          requiredIf(() => {
            return !model.value._id;
          })
        )
      },
      original: {},
      coverImage: {
        required: helpers.withMessage(
          'فایل کاور محصول ضروری است',
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
      //
      if (!v$.value.$invalid) {
        const temp: any = new FormData();

        temp.append('title', model.value.title);
        temp.append('price', model.value.price);
        temp.append('specialPrice', model.value.specialPrice);

        // temp.append('category', { _id: model.category._id });
        temp.append('description', model.value.description);
        temp.append('newProduct', model.value.newProduct);
        temp.append('grade[_id]', currentGrade.value);
        temp.append('group[_id]', currentGroup.value);
        temp.append('field[_id]', currentField.value);
        temp.append('orientation[_id]', currentOrientation.value);

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
            specialPrice: model.value.specialPrice,
            category: { _id: model.value.category._id },
            newProduct: model.value.newProduct,
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
            }
          } as any;
          // model.coverImageFile && (tmp.coverImageFile = model.coverImageFile);
          // console.log(model);
          StoreServiceApi.update(model.value._id, tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'store'
            });
          });
        } else {
          model.value.category &&
            temp.append('category[_id]', model.value.category._id);
          model.value.demo && temp.append('demo', model.value.demo);
          model.value.original && temp.append('original', model.value.original);
          model.value.coverImage &&
            temp.append('coverImage', model.value.coverImage);
          StoreServiceApi.create(temp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'store'
            });
          });
        }
      }
    };
    //
    const cancel = () => {
      router.push({
        name: 'store'
      });
      alertify.notify('cancelled action');
    };
    //

    return {
      v$,
      model,
      changeFile,
      save,
      cancel,
      allCategories,
      currentGrade,
      currentGroup,
      currentField,
      currentOrientation,
      filteredGroups,
      filteredFields,
      filteredOrientation,
      grades
    };
  }
});
</script>
<style scoped lang="scss">
.files {
  margin: 2rem 5rem 1rem 0;
}
h6 {
  font-size: smaller;
  color: rgb(136, 133, 133);
}
</style>

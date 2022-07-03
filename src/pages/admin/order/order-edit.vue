<template>
  <div class="panel">
    <h2>
      {{
        model._id
          ? `ویرایش فاکتور  ${
              model.student
                ? model.student.firstname + ' ' + model.student.lastname
                : ''
            }`
          : 'تعریف فاکتور جدید'
      }}
    </h2>
    <form @submit.prevent="save" class="mt-5">
      <div class="form-row">
        <div class="form-group col-md-4 flex col-sm-12 center-block">
          <label for="student">دانشجو :</label>
          <vSelect
            v-if="model.student"
            class="style-chooser"
            v-model="model.student._id"
            label="fullname"
            :options="students"
            :reduce="(student) => student._id"
            placeholder="انتخاب دانشجو"
            dir="rtl"
          ></vSelect>
          <span
            v-for="error in v$.student.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <div class="form-group col-md-4 flex col-sm-12 center-block">
          <label for="student">وضعیت فاکتور :</label>
          <vSelect
            class="style-chooser"
            v-model="model.status"
            label="text"
            :options="statuses"
            :reduce="(status) => status.id"
            placeholder="انتخاب وضعیت"
            dir="rtl"
          ></vSelect>
          <span
            v-for="error in v$.status.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
      </div>
      <hr />
      <div class="form-row">
        <h3 class="form-group col-md-3 flex col-sm-12 center-block">محصولات</h3>
        <div class="form-group col-md-3 flex col-sm-12 center-block">
          <button
            style="margin: 0.5rem"
            type="button"
            class="btn btn-secondary"
            @click="addNewItem()"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <div class="form-row" v-for="(item, index) in model.items" :key="index">
        <div class="form-group col-md-3 flex col-sm-12 center-block">
          <label for="student">محصول {{ index + 1 }}:</label>
          <vSelect
            class="style-chooser"
            v-model="item.product._id"
            label="title"
            :options="products"
            :selectable="disableProductItem"
            :reduce="(product) => product._id"
            placeholder="انتخاب محصول"
            dir="rtl"
          ></vSelect>
        </div>
        <div class="form-group col-md-3 flex col-sm-12 center-block">
          <label for="student">تعداد :</label>

          <input
            type="number"
            class="form-control"
            id="title"
            v-model="item.quantity"
          />
        </div>
        <div class="form-group col-md-2 flex col-sm-12 center-block">
          <label :for="'price-' + index">قیمت واحد :</label>
          <span class="form-control" :id="'price-' + index">{{
            getProductPrice(item.product._id)
          }}</span>
        </div>
        <div class="form-group col-md-2 flex col-sm-12 center-block">
          <label for="itemPrice">قیمت :</label>
          <span class="form-control" :id="'itemPrice-' + index">{{
            getProductPrice(item.product._id) * item.quantity
          }}</span>
        </div>
        <div class="form-group col-md-2 flex col-sm-12 center-block">
          <button
            type="button"
            class="btn btn-secondary mt-4"
            @click="removeItem(index)"
          >
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <hr />
      <div class="form-row">
        <span>مجموع فاکتور: </span> <span>{{ totalPrice }}</span>
      </div>
      <button class="btn btn-secondary ml-3 mt-4" @click="cancel()">
        برگشت
      </button>
      <button type="submit" class="btn btn-primary mt-4">ذخیره</button>
    </form>
  </div>
</template>

<script lang="ts">
import { OrderServiceApi } from '@/api/services/admin/order-service';
import { StoreServiceApi } from '@/api/services/admin/store-service';
import { StudentServiceApi } from '@/api/services/admin/student-service';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { computed, defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import alertify from "@/assets/alertifyjs/alertify"
export default defineComponent({
  components: {
    vSelect
  },
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  setup() {
    const route = useRoute();
    // This decides if model should be the same thing or re created
    let model = ref({} as any);
    let students = ref<any>([]);
    let products = ref<any>([]);
    let statuses = ref<any>([
      {
        id: 'pending',
        text: 'در انتظار پرداخت'
      },
      {
        id: 'paid',
        text: 'پرداخت شده'
      },
      {
        id: 'cancel',
        text: 'لغو شده'
      }
    ]);

    // getting data from the database
    if (route.params.orderId) {
      OrderServiceApi.get(route.params.orderId as string).then((result) => {
        let data = result.data.data;
        model.value._id = data._id;
        model.value.student = data.student;
        model.value.status = data.status;
        model.value.createdAt = data.createdAt;
        model.value.items = data.items;
        model.value.totalIncludingTax = data.totalIncludingTax;
        model.value.totalTax = data.totalTax;
      });
    } else {
      model.value.student = {};
      model.value.items = [];
    }
    StudentServiceApi.getAll().then((response) => {
      if (response.data.status == 0) {
        students.value = response.data.data.map((m) => {
          return { ...m, fullname: m.firstname + ' ' + m.lastname };
        });
      }
    });
    StoreServiceApi.getAll().then((response) => {
      if (response.data.status == 0) {
        products.value = response.data.data;
      }
    });

    const save = () => {
      /// error handeling
      //
      if (!v$.value.$invalid) {
        let tmp = {
          student: {
            _id: model.value.student._id
          },
          status: model.value.status,
          items: model.value.items
            .filter((p) => !!p.product._id)
            .map((m) => {
              let product = products.value.find((p) => p._id == m.product._id);
              return {
                product: {
                  _id: m.product._id,
                  specialPrice: product.specialPrice ? product.specialPrice : 0,
                  price: product.price
                },
                quantity: m.quantity
              };
            })
        };
        if (model.value._id) {
          OrderServiceApi.adminUpdate(model.value._id, tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'order'
            });
          });
        } else {
          OrderServiceApi.adminCreate(tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'order'
            });
          });
        }
      }
    };

    const rules = computed(() => {
      return {
        student: {
          required: helpers.withMessage('انتخاب دانشجو ضروری است', required)
        },
        status: {
          required: helpers.withMessage('انتخاب وضعیت الزامی است', required)
        }
      };
    }) as any;

    const totalPrice = computed(() => {
      if (model.value.items) {
        let total = model.value.items.reduce((partial_sum, a) => {
          let price = getProductPrice(a.product._id);
          return partial_sum + price * a.quantity;
        }, 0);
        return total;
      } else {
        return 0;
      }
    });

    const v$ = useVuelidate(rules, model);
    // cancel //
    const cancel = () => {
      router.push({
        name: 'order'
      });
    };

    const addNewItem = () => {
      if (!model.value.items || model.value.items.length == 0) {
        model.value.items = [];
      }

      model.value.items.push({
        product: {},
        price: 0,
        quantity: 0
      });
    };

    const disableProductItem = (option) => {
      return !model.value.items.some((s) => s.product._id == option._id);
    };

    const removeItem = (index) => {
      return !model.value.items.splice(index, 1);
    };

    const getProductPrice = (productId) => {
      let product = products.value.find((p) => p._id == productId);
      if (product)
        return product.specialPrice ? product.specialPrice : product.price;
      else return 0;
    };

    return {
      model,
      save,
      cancel,
      v$,
      students,
      statuses,
      products,
      addNewItem,
      disableProductItem,
      removeItem,
      totalPrice,
      getProductPrice
    };
  }
});
</script>

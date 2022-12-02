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
            @click="addNewProduct()"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <div
        class="form-row"
        v-for="(item, index) in productsComputed"
        :key="index"
      >
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
            @click="removeProduct(index)"
          >
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <!--  -->
      <div class="form-row">
        <h3 class="form-group col-md-3 flex col-sm-12 center-block">
          باندل ها
        </h3>
        <div class="form-group col-md-3 flex col-sm-12 center-block">
          <button
            style="margin: 0.5rem"
            type="button"
            class="btn btn-secondary"
            @click="addNewBundle()"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <div
        class="form-row"
        v-for="(item, index) in bundlesComputed"
        :key="index"
      >
        <div class="form-group col-md-3 flex col-sm-12 center-block">
          <label for="student">باندل {{ index + 1 }}:</label>
          <vSelect
            class="style-chooser"
            v-model="item.product._id"
            label="title"
            :options="bundles"
            :selectable="disableProductItem"
            :reduce="(product) => product._id"
            placeholder="انتخاب باندل"
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
            getBundlePrice(item.product._id)
          }}</span>
        </div>

        <div class="form-group col-md-2 flex col-sm-12 center-block">
          <button
            type="button"
            class="btn btn-secondary mt-4"
            @click="removeBundle(index)"
          >
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <!--  -->
      <div class="form-row">
        <h3 class="form-group col-md-3 flex col-sm-12 center-block">
          سر فصل ها
        </h3>
        <div class="form-group col-md-3 flex col-sm-12 center-block">
          <button
            style="margin: 0.5rem"
            type="button"
            class="btn btn-secondary"
            @click="addNewSession()"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <div
        class="form-row"
        v-for="(item, index) in sessionsComputed"
        :key="index"
      >
        <div class="form-group col-md-3 flex col-sm-12 center-block">
          <label for="student">سر فصل {{ index + 1 }}:</label>
          <vSelect
            class="style-chooser"
            v-model="item.product._id"
            label="title"
            :options="sessions"
            :selectable="disableProductItem"
            :reduce="(product) => product._id"
            placeholder="انتخاب فصل"
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
            @click="removeSession"
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

<script lang="ts" setup>
import { OrderServiceApi } from '@/api/services/admin/order-service';
import { StoreServiceApi } from '@/api/services/admin/store-service';
import { StudentServiceApi } from '@/api/services/admin/student-service';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { computed, ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import alertify from '@/assets/alertifyjs/alertify';
import { BundleServiceApi } from '@/api/services/admin/bundle-service';
import { SessionServiceApi } from '@/api/services/admin/session-service';

const route = useRoute();
// This decides if model should be the same thing or re created
let model = ref({} as any);
let students = ref<any>([]);
let productsComputed = ref<any[]>([]);
let bundlesComputed = ref<any[]>([]);
let sessionsComputed = ref<any[]>([]);
//
let products = ref([]);
let bundles = ref([]);
let sessions = ref([]);

//

//
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

onBeforeMount(async () => {
  // getting data from the database
  await (async () => {
    model.value.products = [];
    model.value.bundles = [];
    model.value.sessions = [];
    if (route.params.orderId) {
      const res = await OrderServiceApi.get(route.params.orderId as string);
      let data = res.data.data;
      model.value._id = data._id;
      model.value.student = data.student;
      model.value.status = data.status;
      model.value.createdAt = data.createdAt;
      model.value.items = data.items;
      model.value.totalIncludingTax = data.totalIncludingTax;
      model.value.totalTax = data.totalTax;
    } else {
      model.value.student = {};
      model.value.items = [];
    }
  })();
  StudentServiceApi.getAll().then((response) => {
    if (response.data.status == 0) {
      students.value = response.data.data.map((m) => {
        return { ...m, fullname: m.firstname + ' ' + m.lastname };
      });
    }
  });
  StoreServiceApi.getAll().then((response) => {
    if (response.data.status === 0) {
      products.value = response.data.data;
      model.value.items.forEach((item) => {
        const el = products.value.find(
          (element) => element._id === item.product._id
        );
        if (el) productsComputed.value.push(item);
      });
    }
  });
  BundleServiceApi.getAll().then((response) => {
    if (response.data.status == 0) bundles.value = response.data.data;
    model.value.items.forEach((item) => {
      const el = bundles.value.find(
        (element) => element._id === item.product._id
      );
      if (el) bundlesComputed.value.push(item);
    });
  });
  SessionServiceApi.getAll(model.value.student._id).then((response) => {
    if (response.data.status == 0) sessions.value = response.data.data;
    model.value.items.forEach((item) => {
      const el = sessions.value.find(
        (element) => element._id === item.product._id
      );
      if (el) sessionsComputed.value.push(item);
    });
  });
});

const save = async () => {
  /// error handeling
  //
  model.value.items = [
    ...productsComputed.value.map((el) => ({ ...el, type: 'product' })),
    ...bundlesComputed.value.map((el) => ({ ...el, type: 'bundle' })),
    ...sessionsComputed.value.map((el) => ({ ...el, type: 'session' }))
  ];
  if (v$.value.$invalid) return;
  let tmp = {
    student: {
      _id: model.value.student._id
    },
    status: model.value.status,
    items: model.value.items
      .filter((p) => !!p.product._id)
      .map((m) => {
        // let product: any = products.value.find((p) => p._id == m.product._id);

        const productFunc = () => {
          if (m.type === 'product') {
            return products.value.find((p) => p._id == m.product._id);
          }
          if (m.type === 'bundle') {
            return bundles.value.find((p) => p._id == m.product._id);
          }
          if (m.type === 'session') {
            return sessions.value.find((p) => p._id == m.product._id);
          }
          return false;
        };

        const product = productFunc();

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
    const res = await OrderServiceApi.adminUpdate(model.value._id, tmp);
    alertify.success(res.data.message);
    router.push({
      name: 'order'
    });
  } else {
    const res = await OrderServiceApi.adminCreate(tmp);
    alertify.success(res.data.message);
    router.push({
      name: 'order'
    });
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

const addNewProduct = () => {
  if (!productsComputed.value || productsComputed.value.length == 0) {
    productsComputed.value = [];
  }

  productsComputed.value.push({
    product: {},
    price: 0,
    quantity: 0
  });
};
const addNewBundle = () => {
  if (!bundlesComputed.value || bundlesComputed.value.length == 0) {
    bundlesComputed.value = [];
  }

  bundlesComputed.value.push({
    product: {},
    price: 0,
    quantity: 0
  });
};
const addNewSession = () => {
  if (!sessionsComputed.value || sessionsComputed.value.length == 0) {
    sessionsComputed.value = [];
  }

  sessionsComputed.value.push({
    product: {},
    price: 0,
    quantity: 0
  });
};

const disableProductItem = (option) => {
  return !model.value.items.some((s) => s.product._id == option._id);
};

const removeProduct = (index) => {
  productsComputed.value = productsComputed.value.filter(
    (el, idx) => idx !== index
  );
};
const removeBundle = (index) => {
  bundlesComputed.value = bundlesComputed.value.filter(
    (el, idx) => idx !== index
  );
};
const removeSession = (index) => {
  sessionsComputed.value = sessionsComputed.value.filter(
    (el, idx) => idx !== index
  );
};

const getProductPrice = (productId) => {
  let product = products.value.find((p) => p._id == productId);
  if (product)
    return product.specialPrice ? product.specialPrice : product.price;
  else return 0;
};
const getBundlePrice = (productId) => {
  let product = bundles.value.find((p) => p._id == productId);
  if (product) return product.price;
  else return 0;
};
const getSessionPrice = (productId) => {
  let product = sessions.value.find((p) => p._id == productId);
  if (product) return product.price;
  else return 0;
};
</script>

<template>
  <!-- Spinner -->
  <div
    class="loader-parent"
    v-if="JSON.stringify(model) === JSON.stringify({})"
  >
    <div class="loading1"></div>
  </div>

  <!--  -->
  <div class="shop-book-list" v-else>
    <DesktopMinimalHeader v-if="!isMobile.value" component="shop" />
    <MinimalHeader :title="`${model.title}`" onePageBack="studentShop" />

    <div class="card animate__animated animate__fadeIn">
      <div v-if="!imgUrl" class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>

      <img v-else :src="imgUrl" alt="img of product" />
      <div class="text">
        <!-- <p class="name">کارشناسی ارشد حقوق</p> -->
        <p class="text-detail">{{ model.title }}</p>
        <p :class="`${model.specialPrice ? 'price line-through' : 'price'}`">
          قیمت : {{ toPersianNumbers(model.price) }} تومان
        </p>
        <p class="special-price" v-if="model.specialPrice">
          تخفیف %{{
            toPersianNumbers(
              Math.round(
                ((model.price - model.specialPrice) / model.price) * 100
              )
            )
          }}
          : {{ toPersianNumbers(model.specialPrice) }} تومان
        </p>
        <!-- Add This Item To List Of Sale -->

        <div class="imgs">
          <template v-if="isMobile.value">
            <div class="spinner-border" v-if="isSendingRequest" role="status">
              <span class="sr-only">Loading...</span>
            </div>

            <template v-else-if="!isSendingRequest">
              <div
                class="img-add-div"
                v-if="objectToAddToBasket.item.quantity > 0"
              >
                <span @click="addToBasket(1)">➕ </span>
                <strong style="color: #fff;">
                  {{ toPersianNumbers(`${objectToAddToBasket.item.quantity}`) }}
                </strong>
                <span @touchstart="addToBasket(-1)"> ➖ </span>
              </div>
              <img
                v-else
                @touchstart="addToBasket(1)"
                class="img-add"
                src="@/assets/img/shop/pluss.png"
                alt="plus icon "
              />
            </template>
          </template>

          <template v-else>
            <select v-model="objectToAddToBasket.item.quantity">
              <option v-for="i in 10" :key="i" :value="i">
                {{ toPersianNumbers(i) }} عدد
              </option>
            </select>
            <img
              @click="addToBasket(objectToAddToBasket.item.quantity)"
              class="img-add"
              src="@/assets/img/shop/pluss.png"
              alt="plus icon "
            />
          </template>
        </div>
      </div>
    </div>
    <!-- Preview -->
    <div
      class="preview animate__animated animate__fadeIn"
      @click="openPdfPage(model._id)"
    >
      <img
        class="purple-book"
        src="@/assets/img/shop/bitmap.png"
        alt="purple book icon"
      />
      <span>مشاهده رایگان فصل اول کتاب</span>
      <img src="@/assets/img/shop/right.svg" alt="back icon" class="back-img" />
    </div>
    <!-- Text Detail -->
    <div class="text">
      <div class="text-intro">
        <p v-html="model.description"></p>
      </div>
    </div>
    <ShopFooter />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue';
import ShopFooter from '@/modules/student-modules/footer/shop-footer.vue';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { store } from '@/store';
import { StudentBasketApi } from '@/api/services/student/student-basket-service';
import { StudentproductApi } from '@/api/services/student/student-product';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import displayProtectedImage, {
  returnAProtectedUrl
} from '@/utilities/get-image-from-url';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { baseUrl } from '@/api/apiclient';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import alertify from '@/assets/alertifyjs/alertify';
import router from '@/router';

const props = defineProps({
  item: { type: String, default: '{}' }
});

const model = ref(JSON.parse(props.item as any));
const isSendingRequest = ref(false);
const imgUrl = ref('');
const shopBasket = ref();

if (props.item != '{}') {
  store.commit(StudentMutationTypes.SET_CURRENT_SHOP_INFO, model.value);
}
model.value = store.getters.getCurrentShopInfo;

function openPdfPage(filename) {
  router.push({
    name: 'PDF',
    params: {
      filename: `product/demo/${filename}`
    }
  });
}

const objectToAddToBasket = reactive({
  item: { product: { _id: model.value._id }, quantity: 0 }
});

const updateCurrentProduct = async () => {
  const resPromise = await fetch(`${baseUrl}shopping-cart/get`, {
    method: 'GET',
    headers: {
      token: store.getters.getStudentToken
    }
  });
  const res = await resPromise.json();

  shopBasket.value = res.data;

  const imageUrl = `${baseUrl}product/coverImage/${model.value._id}`;
  imgUrl.value = await returnAProtectedUrl(imageUrl);

  const itemExistsInBasket = shopBasket.value.items.find(
    (el: any) => el.product._id === model.value._id
  );
  return itemExistsInBasket;
};

const addToBasket = async (quantity: number) => {
  const lastQuantity = objectToAddToBasket.item.quantity;
  if (quantity < 0 && objectToAddToBasket.item.quantity == 1) {
    objectToAddToBasket.item.quantity =
      objectToAddToBasket.item.quantity - objectToAddToBasket.item.quantity - 1;
  } else {
    objectToAddToBasket.item.quantity =
      objectToAddToBasket.item.quantity -
      objectToAddToBasket.item.quantity +
      quantity;
  }
  isSendingRequest.value = true;

  try {
    const res = await StudentBasketApi.add(objectToAddToBasket);
    if (res && res.data) {
      alertify.success(res.data.message);
      objectToAddToBasket.item.quantity = lastQuantity + quantity;
      isSendingRequest.value = false;
      updateCount();
    }
  } catch (e) {
    alertify.error('مشکلی رخ داده است! لطفا دوباره امتحان کنید');
  }
};

const updateCount = async () => {
  const resPromise = await fetch(`${baseUrl}shopping-cart/get`, {
    method: 'GET',
    headers: {
      token: store.getters.getStudentToken
    }
  });
  const res = await resPromise.json();

  let quantity = 0;

  res.data.items.forEach((item) => {
    if (item) {
      quantity += 1;
    }
  });

  store.commit(StudentMutationTypes.SET_BASKET_COUNT, quantity);
};

(async () => {
  const resPromise = await fetch(`${baseUrl}shopping-cart/get`, {
    method: 'GET',
    headers: {
      token: store.getters.getStudentToken
    }
  });
  const res = await resPromise.json();

  shopBasket.value = res.data;

  const imageUrl = `${baseUrl}product/coverImage/${model.value._id}`;
  imgUrl.value = await returnAProtectedUrl(imageUrl);
  const itemInBasket = await updateCurrentProduct();
  objectToAddToBasket.item.quantity = itemInBasket?.quantity;

  updateCount();
})();
</script>

<style lang="scss" scoped>
@import '@/css-variable/Global.scss';
.shop-book-list {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 3rem;
  background: #f4f4f4;
  width: 100%;
  height: 100%;
  max-width: 1000px;

  .card {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 95%;
    padding: 0.8rem 1rem;
    border: 1px solid #fff;
    border-radius: 10px;
    box-shadow: 0 11px 17px 0 rgba(41, 94, 255, 0.05);
    background-color: #fff;
    margin: 1rem auto 0.5rem auto;

    .imgs {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      img {
        max-width: 10rem;
        object-fit: contain;
      }
    }

    img {
      width: 99px;
      height: 143px;
      margin: 0 0 1px 10px;
      object-fit: contain;
    }

    .img-add-div {
      background: #d21921;
      border-radius: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      span {
        color: #171717;
        background-color: #fff;
        padding: 7px;
        border-radius: 15px;
        margin-right: 1rem;
        margin-left: 1rem;
      }
    }

    p {
      font-family: IRANSans;
      margin: 10px 5px;
    }

    .img-add {
      width: 100%;
      height: 40px;
      object-fit: contain;
    }

    .text-detail {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 24px;
      color: #171717;
    }

    .price {
      font-size: 12px;
      text-align: right;
      color: #d21921;
      font-weight: bold;
    }
    .line-through {
      text-decoration: line-through;
    }

    .special-price {
      font-size: 12.5px;
      font-weight: bold;
      text-align: right;
      color: #ed1b24;
    }
  }
}

.preview {
  width: 95%;
  height: 57px;
  padding: 10px 10px 10px 13px;
  border-radius: 10px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;
  margin: 0 auto;
  display: flex;
  position: relative;
  align-items: center;

  .purple-book {
    width: 40px;
    height: 37px;
    margin: 0 0 0 5px;
    object-fit: contain;
  }

  span {
    font-family: IRANSans;
    font-size: 12px;
    margin-right: 0.25rem;
    font-weight: bold;
    color: #313131;
  }
  .back-img {
    position: absolute;
    left: 0;
    margin-left: 1em;
  }
}

.text {
  width: 100%;
  font-family: IRANSans;
  text-align: right;
  padding: 0.4rem 1rem;
  font-size: 0.825rem;
  margin-top: 1rem;

  .text-intro {
    p {
      margin: 5px 0;
    }
  }

  p {
    color: #646464;
    line-height: 1.43;
    margin: 1.75rem 0;

    &:last-child {
      margin-bottom: 3rem;
    }
  }

  h5 {
    font-size: 1rem;
    font-weight: bold;
    color: #171717;
  }
}

select {
  z-index: 10;
  background: #313131;
  color: #fff;
  border-radius: 12px;
}
</style>

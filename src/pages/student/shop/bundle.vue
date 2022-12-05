script
<template>
  <!-- Spinner -->
  <div class="loader-parent" v-if="isFetching">
    <div class="loading1"></div>
  </div>
  <!--  -->
  <div class="shop-book-list" v-else>
    <DesktopMinimalHeader v-if="!isMobile.value" component="shop" />
    <Header />
    <MinimalHeader :title="`لیست باندل ها`" goOnePageBack="Shop" />
    <main
      class="card-container animate__animated animate__fadeIn"
      v-if="isMobile.value"
    >
      <section
        class="card animate__animated animate__fadeIn"
        v-for="product in data"
        :key="product"
        @click="openSingleBookPage(JSON.stringify(product))"
      >
        <div class="image-container">
          <div v-if="!product.img" class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <img
            :src="product.img"
            class="animate__animated animate__fadeInDownBig"
            v-else
            alt="product img"
          />
        </div>

        <!--  -->
        <div class="text">
          <!-- <p class="name">{{ product.name || 'کارشناسی ارشد حقوق' }}</p> -->
          <p class="text-detail">
            {{ product.title }}
          </p>
          <p class="price line-t">
            قیمت : {{ toPersianNumbers(product.price) }} تومان
          </p>
          <div style="width: 100%; display: flex; align-items: flex-start">
            <RemoveBundle
              v-if="!!product.exists"
              @click.stop="addBundle(product)"
            />
            <div v-else @click.stop="addBundle(product)" class="plus-icon">
              <img src="@/assets/img/plus-icon.png" alt="button copy" />
              اضافه به سبد خرید
            </div>
          </div>
        </div>
      </section>
    </main>

    <main class="card-container-pc animate__animated animate__fadeIn" v-else>
      <section
        class="Card animate__animated animate__fadeIn"
        v-for="product in data"
        @click.self="openSingleBookPage(JSON.stringify(product))"
        :key="product"
      >
        <img
          class="animate__animated animate__fadeIn"
          v-if="product.img"
          :src="product.img"
          style="margin: 0.4rem"
          alt="product img"
        />
        <div class="txts" @click="openSingleBookPage(JSON.stringify(product))">
          <p class="title">{{ product.title }}</p>
          <p class="price">
            قیمت : {{ toPersianNumbers(product.price) }} تومان
          </p>

          <div style="width: 100%; display: flex; align-items: flex-start">
            <RemoveBundle
              v-if="!!product.exists"
              @click.stop="addBundle(product)"
            />
            <div v-else @click.stop="addBundle(product)" class="plus-icon">
              <img src="@/assets/img/plus-icon.png" alt="button copy" />
              اضافه به سبد خرید
            </div>
          </div>
        </div>
      </section>
    </main>

    <section v-if="!data.length" class="error">
      <img src="@/assets/img/error.png" alt="error" />
      <h4>هیچ اطلاعاتی برای نمایش ندارید</h4>
    </section>

    <ShopFooter />
  </div>
</template>

<script lang="ts" setup>
// Get All The Books The Relate To This Genre And List It In The Template
import { ref } from 'vue';
import { StudentproductApi } from '@/api/services/student/student-product';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import router from '@/router';
import ShopFooter from '@/modules/student-modules/footer/shop-footer.vue';
import { returnAProtectedUrl } from '@/utilities/get-image-from-url';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import Header from '@/modules/student-modules/header/header.vue';
import { baseUrl } from '@/api/apiclient';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { StudentBasketApi } from '@/api/services/student/student-basket-service';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import { store } from '@/store';
import alertify from '@/assets/alertifyjs/alertify';
import RemoveBundle from '@/modules/student-modules/remove-bundle.vue';

const data = ref<any[]>([]);
const isFetching = ref(false);

const openSingleBookPage = (item) => {
  router.push({ name: 'SingleBookInfo', params: { item } });
};

(async () => {
  isFetching.value = true;
  const getAllProducts = await StudentproductApi.getAllBundles();
  data.value = getAllProducts.data.data;

  const imgPromises = [] as any;

  data.value.forEach((data) => {
    // Setting The Initial Quantity

    data.quantity = 1;

    const imageUrl = `${baseUrl}product/coverImage/${data._id}`;
    // For Each Data Element Set It's Image to Returned Image from DB
    imgPromises.push(returnAProtectedUrl(imageUrl));
  });

  const promises = await Promise.all(imgPromises);
  promises.forEach((img, idx) => {
    data.value[idx].img = img;
  });

  // making a list of promises for images and appending them to their list
  isFetching.value = false;
})();

const addBundle = async (product) => {
  // remove
  if (product.exists) {
    try {
      await StudentBasketApi.removeBundle(product._id);

      store.commit(
        StudentMutationTypes.SET_BASKET_COUNT,
        store.getters.getBasketCount - 1
      );
      product.exists = false;
    } catch (error) {}
    return;
  }
  // add
  try {
    const res = await StudentBasketApi.addBundle({
      bundle: { _id: product._id }
    });

    if (res.data) {
      store.commit(
        StudentMutationTypes.SET_BASKET_COUNT,
        store.getters.getBasketCount + 1
      );

      alertify.success('محصول مورد نظر به سبد شما اضافه شد');
      product.exists = true;
    }
  } catch (error) {}
};

(async () => {
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

  // Check FOr ITems TO Exist Or Not

  res.data.bundles.forEach((element) => {
    console.log(data.value);
    const Index = data.value.findIndex(
      (el) => el._id === element.productBundle._id
    );
    if (Index < 0) return;
    data.value[Index].exists = true;
  });
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
  font-family: IRANSans;
  max-width: 1000px;

  .card-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1rem;

    .card {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      width: 90%;
      padding: 0.3rem;
      min-height: 8rem;
      border: 1px solid #fff;
      border-radius: 10px;
      box-shadow: 0 11px 17px 0 rgba(41, 94, 255, 0.05);
      background-color: #fff;

      &:last-child {
        margin-bottom: 4rem;
      }

      .image-container {
        min-width: 30%;
        max-width: 40%;
        display: flex;
        align-items: center;
        justify-items: center;

        img {
          width: 100%;
          object-fit: contain;
        }
      }

      p {
        margin: 10px 10px;
      }

      .name {
        font-size: 10px;
        text-align: right;
        color: #646464;
      }
      .text-detail {
        font-size: 14px;
        font-weight: bold;
        text-align: right;
        color: #171717;
      }

      .price {
        font-size: 12px;
        text-align: right;
        color: #d21921;
        font-weight: bold;
      }
      .special-price {
        font-weight: bold;
      }
    }

    .line-t {
      position: relative;
      display: inline-block;
      font-size: 12.5px;
      color: #ed1b24;
      white-space: nowrap;
      span {
        position: absolute;
        width: 100%;
        border-top: 2px solid red;
        left: 0;
        top: 50%;
        opacity: 0.2;
      }
    }
  }
}

.card-container-pc {
  width: 100%;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(2, 1fr);

  .Card {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    padding-bottom: 5rem;
    transition: all 0.3 ease;
    background: #fff;

    &:hover {
      cursor: pointer;
      background: rgba(255, 255, 255, 0.404);
    }

    .plus {
      display: flex;
      align-items: center;
      justify-content: space-between;

      background: #4ac367;
      border-bottom-right-radius: 14.5px;
      border-bottom-left-radius: 14.5px;
      cursor: pointer;

      .pluss {
        max-width: 10rem;
      }

      img {
        width: 50%;
        z-index: 1;
        object-fit: right;
        position: absolute;
        right: 0;
      }

      select {
        z-index: 10;
        background: #313131;
        color: #fff;
        border-radius: 12px;
        margin-right: 65%;
      }
    }

    .txts {
      flex-grow: 1;
      display: grid;
      flex-direction: column;
      align-items: start;
      justify-content: start;
      grid-gap: 0.3rem;

      .title {
        font-size: 15.5px;
        font-weight: bold;
        text-align: right;
        color: #171717;
      }

      .price {
        font-size: 10px;
        text-align: right;
        color: #d21921;
        text-decoration: line-through;
        word-break: normal;
        white-space: nowrap;
      }

      .special-price {
        font-size: 10.5px;
        font-weight: bold;
        color: #ed1b24;
        white-space: nowrap;
      }
    }

    img {
      flex-basis: 25%;
      width: 30%;
    }
  }
}

.error {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  transform: translateY(30%);
  img {
    width: 18rem;
    max-width: 450px;
  }
  h4 {
    margin-top: 0.5rem;
    font-size: 1.2rem;
  }
}

.plus-icon {
  background: linear-gradient(
    267.92deg,
    #669bbc 0%,
    #577b92 104.72%,
    #669bbc 104.73%
  );
  display: flex;
  align-items: center;
  color: white;
  gap: 1rem;
  padding: 1rem;
  border-radius: 7px;
  width: 12rem;
  font-size: 12px;
  height: 2.5rem;
}
</style>

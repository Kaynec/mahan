<template>
  <!-- DESKTOP  -->
  <main class="desktop" v-if="!mobile">
    <DesktopMinimalHeader component="shop" />
    <img
      src="@/assets/img/shop/shop-pc@3x.png"
      class="header-img class animate__animatd animate__fadeIn"
      alt="header"
    />
    <section class="category-img">
      <div
        class="img-container animate__animated animate__fadeIn"
        v-for="item in productCategories"
        :key="item._id"
      >
        <div v-if="!item.img" class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>

        <img
          :src="item.img"
          @click="sendToBookShopList(item._id, item.title)"
          v-else
          class="animate__animatd animate__fadeIn"
          alt="category img"
        />
      </div>
    </section>
    <!--  -->

    <div class="buttons">
      <button
        @click="() => (currentState = 'yourProduct')"
        :class="{ active: currentState == 'yourProduct' }"
      >
        ماهان من
      </button>
      <button
        @click="() => (currentState = 'newsetProduct')"
        :class="{ active: currentState == 'newsetProduct' }"
      >
        تازه ترین محصولات
      </button>
    </div>

    <!-- Cards -->
    <div class="Cards">
      <template v-if="currentState == 'yourProduct'">
        <!-- Empty Right Now But We Will Fill It Later With Database Data -->
        <section
          class="Card animate__animated animate__fadeIn"
          v-for="product in yourProduct"
          @click="showYourProductAlert"
          :key="product"
        >
          <div v-if="!product.img" class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <img
            class="animate__animatd animate__fadeIn"
            v-if="product.img"
            :src="product.img"
            alt="product img"
          />
          <div class="txts" @click="openSingleBookPage(product)">
            <p class="title">{{ product.title }}</p>
            <!-- <p class="price">
              قیمت : {{ toPersianNumbers(product.price) }} تومان
            </p> -->
            <!-- <p class="special-price">
              تخفیف %{{
                toPersianNumbers(
                  Math.round(
                    ((product.price - product.specialPrice) / product.price) *
                      100
                  )
                )
              }}
              :
              {{ toPersianNumbers(product.specialPrice) }} تومان
            </p> -->
          </div>
          <!--  -->
          <!-- <div class="plus">
            <img
              src="@/assets/img/shop/pluss.png"
              @click.stop="addToBasket(product)"
              alt="plus"
            />
            <select v-model="product.quantity">
              <option v-for="i in 10" :key="i" :value="i">
                {{ toPersianNumbers(i) }} عدد
              </option>
            </select>
          </div> -->
        </section>
      </template>

      <template v-if="currentState == 'newsetProduct'">
        <section
          @click.self="openSingleBookPage(product)"
          class="Card"
          v-for="product in newsetData"
          :key="product"
        >
          <div v-if="!product.img" class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <img v-if="product.img" :src="product.img" alt="product img" />
          <div class="txts">
            <p class="title">{{ product.title }}</p>
            <p class="price">
              قیمت : {{ toPersianNumbers(product.price) }} تومان
            </p>
            <p class="special-price">
              تخفیف %{{
                toPersianNumbers(
                  Math.round(
                    ((product.price - product.specialPrice) / product.price) *
                      100
                  )
                )
              }}
              :
              {{ toPersianNumbers(product.specialPrice) }} تومان
            </p>
          </div>
          <!--  -->
          <div class="plus">
            <img
              src="@/assets/img/shop/pluss.png"
              style="max-width: 15rem height: 80%"
              @click.stop="addToBasket(product)"
              alt="plus img"
            />
            <select v-model="product.quantity">
              <option v-for="i in 10" :key="i" :value="i">
                {{ toPersianNumbers(i) }} عدد
              </option>
            </select>
          </div>
        </section>
      </template>
    </div>
  </main>

  <!-- MOBILE  -->

  <main class="shop" v-else>
    <!-- <SmallHeader onePageBack="Home" /> -->
    <Header />
    <MinimalHeader title="محصولات" />
    <div class="grid animate__animated animate__fadeIn">
      <div
        class="img-container"
        v-for="item in productCategories"
        :key="item._id"
      >
        <div v-if="!item.img" class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <img
          :src="item.img"
          @click="sendToBookShopList(item._id, item.title)"
          alt="category img"
          v-else
        />
      </div>
    </div>
    <!--  -->
    <div class="buttons">
      <button
        @click="() => (currentState = 'yourProduct')"
        :class="{ active: currentState == 'yourProduct' }"
      >
        ماهان من
      </button>
      <button
        @click="() => (currentState = 'newsetProduct')"
        :class="{ active: currentState == 'newsetProduct' }"
      >
        تازه ترین محصولات
      </button>
    </div>
    <!--  -->
    <div class="Cards">
      <template v-if="currentState == 'yourProduct'">
        <!-- Empty Right Now But We Will Fill It Later With Database Data -->
        <div
          class="Card animate__animated animate__fadeIn"
          v-for="product in yourProduct"
          @click="showYourProductAlert"
          :key="product"
        >
          <div v-if="!product.img" class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <img
            class="animate__animatd animate__fadeIn"
            v-else
            :src="product.img"
            alt="product img"
          />

          <p>{{ product.title }}</p>
        </div>
      </template>

      <template v-if="currentState == 'newsetProduct'">
        <div
          class="Card animate__animated animate__fadeIn"
          v-for="product in newsetData"
          @click="openSingleBookPage(product)"
          :key="product"
        >
          <div v-if="!product.img" class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>

          <img
            v-if="product.img"
            class="animate__animatd animate__fadeIn"
            :src="product.img"
            alt="product img"
          />
          <p>{{ product.title }}</p>
        </div>
      </template>
    </div>
    <!-- Footer -->
    <ShopFooter />
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { StudentproductApi } from '@/api/services/student/student-product';
import router from '@/router';
import ShopFooter from '@/modules/student-modules/footer/shop-footer.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { baseUrl } from '@/api/apiclient';
import { store } from '@/store';
import { returnAProtectedUrl } from '@/utilities/get-image-from-url';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import { StudentBasketApi } from '@/api/services/student/student-basket-service';
import alertify from '@/assets/alertifyjs/alertify';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import Header from '@/modules/student-modules/header/header.vue';

const productCategories = ref([]) as any;
const isFetching = ref(true);
const newsetData = ref([]) as any;
const yourProduct = ref([]) as any;

(async () => {
  const getAllCategoriesImgs = [] as any;
  const getNewProductsImgs = [] as any;
  const res = await StudentproductApi.getAllCategories();

  if (res.data) {
    productCategories.value = res.data.data;
    productCategories.value.forEach((data) => {
      const imageUrl = `${baseUrl}product-category/coverImage/${data._id}`;
      getAllCategoriesImgs.push(returnAProtectedUrl(imageUrl));
    });
  }

  const newDataRes = await StudentproductApi.getNewProducts();

  if (newDataRes.data) {
    newsetData.value = newDataRes.data.data;

    newsetData.value.forEach((data) => {
      const imageUrl = `${baseUrl}product/coverImage/${data._id}`;
      data.quantity = 1;
      getNewProductsImgs.push(returnAProtectedUrl(imageUrl));
    });
  }

  const newImgs = await Promise.all(getNewProductsImgs);

  newImgs.forEach((img, idx) => {
    // Setting The Image and also quantity to default of 1
    newsetData.value[idx].img = img;
  });

  const categoryImgs = await Promise.all(getAllCategoriesImgs);

  categoryImgs.forEach((img, idx) => {
    // Setting The Image and also quantity to default of 1
    productCategories.value[idx].img = img;
  });

  // Using Fetch here To Avoid The Alertify Error message

  const getBoughtProductsRes = await fetch(
    `${baseUrl}order/getBoughtProducts`,
    {
      headers: {
        token: store.getters.getStudentToken
      }
    }
  );

  const getBoughtProducts = await getBoughtProductsRes.json();

  let boughtImgPromises = [] as any;

  if (getBoughtProducts.data) {
    getBoughtProducts.data.forEach((child) => yourProduct.value.push(child));
    yourProduct.value.forEach((data, idx) => {
      const imageUrl = `${baseUrl}product/coverImage/${data._id}`;
      boughtImgPromises.push(returnAProtectedUrl(imageUrl));
      yourProduct.value[idx].img = imageUrl;
    });
  }

  const boughtimages = await Promise.all(boughtImgPromises);
  boughtimages.forEach((img, idx) => {
    console.log(img, idx);
    // Setting The Image and also quantity to default of 1
    yourProduct.value[idx].img = img;
  });

  isFetching.value = false;
})();

(async () => {
  updateCount();
})();

const currentState = ref('newsetProduct');
const sendToBookShopList = (id: string, title: string) => {
  router.push({
    name: 'ShopBookList',
    params: { id, title }
  });
};

const openSingleBookPage = (item) => {
  router.push({
    name: 'SingleBookInfo',
    params: { item: JSON.stringify(item) }
  });
};

const moveToBasket = () => {
  router.push({
    name: 'ShopBasket'
  });
};

const addToBasket = async (product) => {
  const itemToSend = {
    item: {
      product: { _id: product._id },
      quantity: product.quantity
    }
  };

  const res = await StudentBasketApi.add(itemToSend);

  if (res.data) {
    store.commit(
      StudentMutationTypes.SET_BASKET_COUNT,
      store.getters.getBasketCount + 1
    );

    alertify.success('محصول مورد نظر به سبد شما اضافه شد');
  }
};

function showYourProductAlert() {
  alertify.error('لطفا برای مشاهده محصول از اپلیکیشن ماهان استفاده کنید');
}
</script>

<style lang="scss" scoped>
@import '@/css-variable/Global.scss';
.shop,
.desktop {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 3rem;

  .grid {
    display: grid;
    position: relative;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: 0.25rem;
    padding: 0.5rem;
    justify-items: center;
    align-items: center;
    margin-bottom: 0.5rem;
    img {
      object-fit: contain;
      max-width: 100%;
    }
  }

  .img-container {
    min-width: 35%;
    min-height: 30vh;
    display: flex;
    align-items: center;
    justify-items: center;
    position: relative;
  }

  .buttons {
    margin: 1rem auto;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;

    button {
      font-family: IRANSans;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 15px;
      outline: none;
      border: none;
      width: 50%;
      box-shadow: 0 0 23px 0 rgba(0, 0, 0, 0.13);
      background: white;
      color: #171717;

      &:nth-child(2) {
        border-radius: 10px 0px 0px 10px;
      }
      &:nth-child(1) {
        border-radius: 0px 10px 10px 0px;
      }
    }
  }
  button.active {
    background-image: $blueish-background;
    color: #fff;
  }
  //
  .Cards {
    display: grid;
    overflow: hidden;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 1fr;
    margin: 1rem auto 3.5rem;
    width: 90%;
    grid-gap: 0.5rem;
    position: relative;

    .Card {
      padding: 3px 4px;
      border-radius: 14.7px;
      box-shadow: -2px 2px 3px 0 rgba(0, 0, 0, 0.08);
      background-color: #fff;
      img {
        width: 90%;
        object-fit: contain;
        margin: 0 auto;
        padding: 0.5rem;
      }

      p {
        margin: 2px 18px 0;
        font-family: IRANSans;
        font-size: 12px;
        text-align: center;
        color: #171717;
      }
    }
  }
}

.desktop {
  max-width: 1000px;

  padding-top: 8vh;
  position: relative;

  .buttons {
    width: 100%;
    position: relative;

    button {
      width: 50%;
    }
  }

  .header-img {
    max-width: 100%;
    object-fit: contain;
    position: relative;
  }

  .category-img {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 0.25rem;
    position: relative;

    .img-container {
      position: relative;
      img {
        width: 100%;
        object-fit: contain;
      }
    }
  }

  .Cards {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    position: relative;

    .Card {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      padding-bottom: 5rem;
      transition: all 0.3 ease;

      &:hover {
        cursor: pointer;
        background: rgba(255, 255, 255, 0.404);
      }

      .plus {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: space-between;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #4ac367;
        border-bottom-right-radius: 14.5px;
        border-bottom-left-radius: 14.5px;
        padding: 0 1rem;
        cursor: pointer;

        img {
          width: 50%;
          z-index: 1;
          object-fit: right;
          position: absolute;
          right: 0;
        }

        select {
          margin-right: 65%;
          z-index: 10;
          background: #313131;
          color: #fff;
          border-radius: 12px;
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
          font-size: 11.6px;
          text-align: right;
          color: #d21921;
          text-decoration: line-through;
        }

        .special-price {
          font-size: 13.6px;
          font-weight: bold;
          text-align: right;
          color: #ed1b24;
        }
      }

      img {
        flex-basis: 25%;
        width: 30%;
      }
    }
  }
}
</style>

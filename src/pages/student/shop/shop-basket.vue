<template>
  <!-- <div class="desktop" v-if="!mobile"></div> -->
  <div class="shop-basket" v-if="mobile">
    <Header />
    <MinimalHeader title="سبد خرید شما" />

    <div class="error" v-if="basketItems.length < 0">
      <img src="@/assets/img/error.png" alt="error" />
      <h4>سبد خرید شما خالی است</h4>
    </div>

    <div class="container animate__animated animate__fadeIn">
      <!-- Change The Data -->
      <div class="text-flex">
        <span>
          شماره سفارش: {{ toPersianNumbers(`${purchaseId || ''}`) }}
        </span>
        <span> {{ faDate }} </span>
      </div>

      <!-- 
  <div class="right">
          <div v-if="!item.img" class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <img :src="item.img" alt="product img" v-else />
          <div class="label">
            <span>
              {{
                `${item.product.title} ${
                  +item.quantity > 1 ? `تعداد (${item.quantity})` : ''
                }`
              }}
            </span>
            <span @click="removeItem(item)" style="display: block" class="red"
              >حذف محصول</span
            >
          </div>
        </div>
        <div class="left">
          <p v-if="item.product.specialPrice">
            {{ toPersianNumbers(`${item.product.specialPrice}`) }} تومان
          </p>
          <p :class="`${item.product.specialPrice ? 'red line-through' : ''}`">
            {{ toPersianNumbers(`${item.product.price}`) }} تومان
          </p>
        </div>
 -->
      <div class="basket-card" v-for="item in basketItems" :key="item._id">
        <template
          v-if="
            item.hasOwnProperty('session') ||
            item.hasOwnProperty('productBundle')
          "
        >
          <div class="right">
            <div v-if="!item.img" class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <img :src="item.img" alt="product img" v-else />
            <!-- If The Type is product (has quantiy) -->
            <div class="label" style="margin-right: 0.5rem">
              <span>
                {{ item.productBundle?.title || item.session?.title }}
              </span>
              <span
                @click="
                  item.hasOwnProperty('productBundle')
                    ? removeBundleFromBasket(item._id)
                    : removeSessionFromBasket(item)
                "
                style="display: block"
                class="red"
                >حذف محصول</span
              >
            </div>
          </div>
          <div class="left">
            <p>
              {{ toPersianNumbers(`${item?.price}`) }}
              تومان
            </p>
          </div>
        </template>
        <!--  -->
        <template v-else>
          <div class="right">
            <div v-if="!item.img" class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <img :src="item.img" alt="product img" v-else />
            <div class="label" style="margin-right: 0.5rem">
              {{
                `${item.product.title} ${
                  +item.quantity > 1 ? `تعداد (${item.quantity})` : ''
                }`
              }}
              <span @click="removeItem(item)" style="display: block" class="red"
                >حذف محصول</span
              >
            </div>
          </div>
          <div class="left">
            <p v-if="item.product.specialPrice">
              {{ toPersianNumbers(`${item.product.specialPrice}`) }}
              تومان
            </p>
            <p
              :class="`${item.product.specialPrice ? 'red line-through' : ''}`"
            >
              {{ toPersianNumbers(`${item.product.price}`) }} تومان
            </p>
          </div>
        </template>
      </div>
      <!--  -->
      <div class="price">
        <div class="text">
          <p>هزینه سبد شما</p>
          <p>تخفیف</p>
        </div>
        <div class="number">
          <p>{{ toPersianNumbers(`${allPrice}`) }} تومان</p>
          <p>{{ toPersianNumbers(`${discount}`) }} تومان</p>
        </div>
      </div>
      <!--  -->
      <div class="paid-price">
        <span> مبلغ پرداختی شما </span>
        <span> {{ toPersianNumbers(paidPrice) }} تومان </span>
      </div>

      <!--  -->
      <div class="payment" ref="payment">
        <ChapterList
          :text="`پرداخت از امتیازات کسب شده : ${point}`"
          :chapterContainer="payment"
        />
        <ChapterList
          text="پرداخت از طریق درگاه بانکی"
          :chapterContainer="payment"
        />
      </div>
      <!-- Btn  -->
      <div class="continue" @touchstart="submitOrder">
        <i class="fas fa-arrow-right"></i>
        <span> ثبت و پرداخت نهایی </span>
      </div>
    </div>
  </div>

  <!--  -->
  <div class="shop-basket pc" v-if="!mobile">
    <DesktopMinimalHeader v-if="!mobile" />

    <div class="error" v-if="basketItems.length < 0">
      <img src="@/assets/img/error.png" alt="error img" />
      <h4>سبد خرید شما خالی است</h4>
    </div>

    <!--  -->

    <div class="container">
      <h1>سبد خرید شما</h1>
      <!-- Change The Data -->
      <section class="first">
        <div class="text-flex">
          <span> شماره سفارش: {{ toPersianNumbers(`${purchaseId}`) }} </span>
          <span> {{ faDate }} </span>
        </div>

        <div class="basket-container">
          <div class="basket-card" v-for="item in basketItems" :key="item._id">
            <template v-if="item.hasOwnProperty('productBundle')">
              <!-- Img -->
              <div v-if="!item.img" class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <img :src="item.img" alt="product img" v-else max-w-20 />
              <!-- Right -->
              <div flex flex-col gap-4 grow items-start>
                <span text-black>
                  {{ item.productBundle?.title }}
                </span>
                <span
                  text="#646464 xs"
                  v-for="product in item.productBundle.products"
                  flex
                  items-center
                >
                  <span
                    mx-2
                    w-1
                    h-1
                    bg="#646464"
                    block
                    rounded-full
                    aspect-1
                  ></span>
                  {{ product.title }}
                </span>

                <span
                  @click="
                    item.hasOwnProperty('productBundle')
                      ? removeBundleFromBasket(item._id)
                      : removeSessionFromBasket(item)
                  "
                  style="display: block"
                  class="text-#ED1B24 text-sm"
                  >حذف محصول</span
                >
              </div>
              <!-- Left -->
              <div flex flex-col gap-3 items-end>
                <span font-600 text-xs>
                  {{ toPersianNumbers(`${item?.price}`) }}
                  تومان
                </span>
                <span
                  text-red
                  font-600
                  text-xs
                  v-for="el in item.productBundle.products"
                >
                  {{ toPersianNumbers(`${el?.price}`) }}
                  تومان
                </span>
              </div>
              <!--  -->
            </template>
            <!--  -->
            <template v-else>
              <div class="right">
                <div v-if="!item.img" class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <img :src="item.img" alt="product img" v-else />
                <div class="label" style="margin-right: 0.5rem">
                  {{
                    `${item.product.title} ${
                      +item.quantity > 1 ? `تعداد (${item.quantity})` : ''
                    }`
                  }}
                  <span
                    @click="removeItem(item)"
                    style="display: block"
                    class="red"
                    >حذف محصول</span
                  >
                </div>
              </div>
              <div class="left">
                <p v-if="item.product.specialPrice">
                  {{ toPersianNumbers(`${item.product.specialPrice}`) }}
                  تومان
                </p>
                <p
                  :class="`${
                    item.product.specialPrice ? 'red line-through' : ''
                  }`"
                >
                  {{ toPersianNumbers(`${item.product.price}`) }} تومان
                </p>
              </div>
            </template>
          </div>
        </div>
        <!--  -->
      </section>
      <!--  -->
      <section class="price-container">
        <div class="price">
          <div class="text">
            <p>هزینه سبد شما</p>
            <p>تخفیف</p>
          </div>
          <div class="number">
            <p>{{ toPersianNumbers(`${allPrice}`) }} تومان</p>
            <p>{{ toPersianNumbers(`${discount}`) }} تومان</p>
          </div>
          <!--  -->
        </div>

        <div class="paid-price">
          <span> مبلغ پرداختی شما </span>
          <span> {{ toPersianNumbers(paidPrice) }} تومان </span>
        </div>
      </section>

      <div class="payment" ref="payment">
        <ChapterList
          :text="`پرداخت از امتیازات کسب شده : ${point}`"
          :chapterContainer="payment"
        />
        <ChapterList
          text="پرداخت از طریق درگاه بانکی"
          :chapterContainer="payment"
        />
      </div>
      <div class="continue" @click="submitOrder">
        <i class="fas fa-arrow-right"></i>
        <span> ثبت و پرداخت نهایی </span>
      </div>
      <span class="back" @click="goOnepageBack()">
        برگشت

        <i class="fa fa-angle-right" aria-hidden="true"></i
      ></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onBeforeMount } from 'vue';
import ChapterList from '@/modules/student-modules/chapter-list.vue';
import router from '@/router';
import { StudentBasketApi } from '@/api/services/student/student-basket-service';
import { store } from '@/store';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { baseUrl } from '@/api/apiclient';
import Header from '@/modules/student-modules/header/header.vue';
import { addSessionToBasket, getBasketInfo } from '@/api/basket-functions';
import { returnAProtectedUrl } from '@/utilities/get-image-from-url';

// Remove Item From Basket

const removeBundleFromBasket = async (id) => {
  try {
    await StudentBasketApi.removeBundle(id);
    store.commit(
      StudentMutationTypes.SET_BASKET_COUNT,
      store.state.students.BasketCount - 1
    );
    // updateBasket();
  } catch (error) {
    console.log(error);
  }
};

const removeSessionFromBasket = (item) => {
  addSessionToBasket(item, true);
  // updateBasket();
};

onBeforeMount(() => {
  updateBasket();
});

//

const date = new Date();
const faDate = new Intl.DateTimeFormat('fa', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(date);

const point = ref(store.getters.getCurrentStudent.point);
const allPrice = ref(0);
const allSpecialPrice = ref(0);
const basketItems = ref<any[]>([]);
const purchaseId = ref(0);

const updateBasket = async () => {
  allPrice.value = 0;
  allSpecialPrice.value = 0; //
  basketItems.value = [];
  const imgPromises: any[] = [];
  const res = await getBasketInfo();

  purchaseId.value = res.data._id || '';

  res.data.items.forEach((item) => {
    const imageUrl = `${baseUrl}product/coverImage/${item.product._id}`;
    item.img = imageUrl;
    imgPromises.push(returnAProtectedUrl(imageUrl));
    allPrice.value += item.product.price * item.quantity;
    allSpecialPrice.value += item.product.specialPrice * item.quantity;

    basketItems.value.push(item);
  });

  //
  res.data.bundles.forEach((item) => {
    const imageUrl = `${baseUrl}productBundle/coverImage/${item.productBundle._id}`;
    item.img = imageUrl;
    imgPromises.push(returnAProtectedUrl(imageUrl));
    allPrice.value += item.price;

    basketItems.value.push(item);
  });

  //
  res.data.sessions.forEach((item) => {
    const imageUrl = `${baseUrl}course/download-image/${item.image}`;
    imgPromises.push(returnAProtectedUrl(imageUrl));
    item.img = imageUrl;
    allPrice.value += item.price;

    basketItems.value.push(item);
  });

  const images = await Promise.all(imgPromises);
  images.forEach((img, idx) => {
    basketItems.value[idx].img = img;
  });
};

const payment = ref();

const paidPrice = computed(() => {
  let discountedPrice = discount.value;

  return allPrice.value - discountedPrice;
});

const discount = computed(() => {
  return basketItems.value.reduce((acc, item: any) => {
    if (item.hasOwnProperty('product')) {
      let discount =
        (item.product.price - item.product.specialPrice) * item.quantity;
      acc += discount;
    } else if (item.hasOwnProperty('productBundle')) {
      // If Item Exists in bought
      const allThatExistInBought: any[] = [];
      item.productBundle.products.forEach((element) => {
        if (boughtProducts.value.find((el) => el._id === element._id)) {
          allThatExistInBought.push(element);
        }
      });
      console.log(allThatExistInBought);
      //
      const allPrice = item.productBundle.products.reduce((acc2, item) => {
        return (acc += item.price);
      });

      acc += item.productBundle.price - allPrice;
    }
    return acc;
  }, 0);
});

const submitOrder = () => {
  router.push({ name: 'ShopAddress' });
};
const removeItem = async (item) => {
  const tmpObject = {
    item: {
      product: { _id: item.product._id },
      quantity: -Math.abs(item.quantity)
    }
  };

  try {
    await StudentBasketApi.add(tmpObject);
    // updateBasket();
  } catch (error) {
    console.log(error);
  }
};

const boughtProducts = ref<any[]>([]);

StudentBasketApi.HistoryOfBoughtProducts()
  .then((res) => (boughtProducts.value = res.data.data))
  .catch((err) => console.log(err));

const goOnepageBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
@import '@/css-variable/Global.scss';
.shop-basket {
  position: relative;
  overflow-y: auto;
  padding-bottom: 3rem;
  background: #f4f4f4;
  font-family: IRANSans;
  width: 100%;
  height: 100%;

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

  .container {
    width: 95%;
    margin: 1rem auto;
    border-radius: 15px;
    background: #fff;
    padding: 0.7rem;

    .text-flex {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.8rem 0.25rem;
      border-bottom: solid 0.9px #eee;

      span {
        font-size: 12px;
        line-height: 1.67;
        color: #646464;
      }
    }

    .basket-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      border-bottom: solid 0.9px #eee;

      padding: 0.8rem 0.25rem;

      .right {
        display: flex;
        align-items: center;
        flex-grow: 1;

        img {
          width: 20%;
        }
        span {
          font-size: 11.8px;
          color: #171717;
          display: inline-flex;
          margin: 0.6rem 0.2rem;
        }
      }
      .product-container {
        display: flex;
        flex-direction: column;

        .product {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
      }
      .left {
        flex-basis: 35%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        margin-top: 0.8rem;

        p {
          font-size: 10.9px;
          font-weight: bold;
          color: #171717;
        }
      }
    }
    //
    .price {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: solid 0.9px #eee;
      padding: 0.8rem 0.25rem;

      p {
        margin: 0 0;
      }

      .text {
        font-size: 12px;
        line-height: 2.5;
        text-align: right;
        color: #313131;
      }

      .number {
        font-size: 12px;
        font-weight: bold;
        line-height: 2.5;
        color: #000;
        text-align: left;
      }
    }
    //
    .paid-price {
      display: flex;
      align-items: center;
      justify-content: space-between;

      border-bottom: solid 0.9px #eee;
      padding: 0.8rem 0.25rem;
      color: #4ac367;
      font-size: 13px;
      font-weight: bold;
    }
  }
  //
  .payment {
    width: 100%;
    margin: 1rem auto;
    border-bottom: solid 0.9px #eee;
    //   The CapterList Component
    .chapter {
      width: 100%;
      margin-bottom: 0.5rem;
      box-shadow: none;
      border: 2px solid white;
    }
  }
  //
  .continue {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 15px;
    background-image: $redish-background;
    width: 100%;
    height: 3.5rem;
    margin: 0 auto;

    i {
      background-color: #d21921;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      padding: 10px;
    }

    span {
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      align-self: center;
      width: 50%;
    }
  }
}

.red {
  color: #ed1b24 !important;
  cursor: pointer;
}
.line-through {
  text-decoration: line-through;
}
.red.line-through {
  font-size: 9.1px !important;
}

.pc {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.795);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  h1 {
    font-size: 19px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    padding: 0.5rem;
  }

  .container {
    width: 100%;
    max-width: 500px;
    background-color: transparent;
    margin: 1rem 0 0 0;

    .paid-price {
      border-bottom: none;
      padding: 1rem;
    }

    .first {
      background: #fff;
      width: 100%;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      padding: 1rem;
    }
    .price-container {
      background: #fff;
      width: 100%;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
      padding: 1rem;
    }

    .payment {
      border-bottom: none;
    }
  }
}

.basket-container {
  max-height: 500px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 2rem 0;
}
</style>

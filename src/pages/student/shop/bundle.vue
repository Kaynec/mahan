<template>
  <!-- Spinner -->
  <div class="loader-parent" v-if="isFetching">
    <div class="loading1"></div>
  </div>
  <!--  -->

  <div class="shop-book-list" v-else>
    <DesktopMinimalHeader v-if="!mobile" component="shop" />
    <Header />
    <MinimalHeader :title="`لیست باندل ها`" goOnePageBack="Shop" />

    <main class="flex flex-col gap-2 w-90% mx-auto space-y-3">
      <section
        class="shadow rounded-xl p-2 bg-white animate__animated animate__fadeIn"
        v-for="product in data"
        @click="
          $router.push({
            name: 'BundleInfo',
            params: { item: JSON.stringify(product) }
          })
        "
        :key="product"
      >
        <div class="flex items-start py-3">
          <div ml-2 p-2 rounded-xl w-38>
            <!-- <el-carousel height="150px" indicator-position="outside">
              <el-carousel-item v-for="item in product.products" :key="item">
                <el-image :src="item.img" :key="item.img" fit="contain" />
              </el-carousel-item>
            </el-carousel> -->
          </div>
          <!--  -->
          <div class="flex flex-col gap-3">
            <p class="text-black">{{ product.title }}</p>

            <span
              text="#646464 xs"
              v-for="el in product.products"
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
              {{ el.title }}
            </span>

            <p class="text-blueish">
              قیمت : {{ toPersianNumbers(product.price) }} تومان
            </p>
          </div>
        </div>
        <p text-xs pb-2>
          مجموع قیمت محصولات این باندل به طور مجزا
          {{
            toPersianNumbers(
              product.products.reduce((acc, i) => (acc += i.price), 0)
            )
          }}
          تومان میباشد،قیمت دراین باندل
          {{ toPersianNumbers(product.price) }} تومان است.
        </p>
        <span text-blueish text-xs>
          سود شما از این خرید
          {{
            toPersianNumbers(
              product.products.reduce((acc, i) => (acc += i.price), 0) -
                product.price
            )
          }}
          تومان است.
        </span>
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
import ShopFooter from '@/modules/student-modules/footer/shop-footer.vue';
import { returnAProtectedUrl } from '@/utilities/get-image-from-url';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import Header from '@/modules/student-modules/header/header.vue';
import { baseUrl } from '@/api/apiclient';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';

// import { StudentBasketApi } from '@/api/services/student/student-basket-service';
// import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
// import { store } from '@/store';
// import alertify from '@/assets/alertifyjs/alertify';
// import RemoveBundle from '@/modules/student-modules/remove-bundle.vue';

const data = ref<any[]>([]);
const isFetching = ref(false);

(async () => {
  isFetching.value = true;
  const getAllProducts = await StudentproductApi.getAllBundles();
  data.value = getAllProducts.data.data;

  //
  // Check FOr ITems TO Exist Or Not
  data.value.forEach(async (element) => {
    const imgPromises: any[] = [];
    element.products.forEach((el) => {
      const imageUrl = `${baseUrl}product/coverImage/${el._id}`;
      // For Each Data Element Set It's Image to Returned Image from DB
      imgPromises.push(returnAProtectedUrl(imageUrl));
    });
    Promise.all(imgPromises).then((imgs) => {
      imgs.forEach((img, idx) => {
        element.products[idx].img = img;
      });
    });
  });
  // making a list of promises for images and appending them to their list
  isFetching.value = false;
})();

// const addBundle = async (product) => {
//   // remove
//   if (product.exists) {
//     try {
//       await StudentBasketApi.removeBundle(product._id);

//       store.commit(
//         StudentMutationTypes.SET_BASKET_COUNT,
//         store.getters.getBasketCount - 1
//       );
//       product.exists = false;
//     } catch (error) {}
//     return;
//   }
//   // add
//   try {
//     const res = await StudentBasketApi.addBundle({
//       bundle: { _id: product._id }
//     });

//     if (res.data) {
//       store.commit(
//         StudentMutationTypes.SET_BASKET_COUNT,
//         store.getters.getBasketCount + 1
//       );

//       alertify.success('محصول مورد نظر به سبد شما اضافه شد');
//       product.exists = true;
//     }
//   } catch (error) {}
// };

(async () => {
  const res = await updateCount();
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

<template>
  <div class="container animate__animated animate__fadeIn">
    <div class="wrapper">
      <aside>
        <img
          @click="moveToComponent('Home')"
          src="@/assets/img/mahan-logo.png"
          class="header"
          alt="header"
        />
        <div class="cart-container">
          <div @click="moveToComponent('ShopBundle')">
            <img
              src="@/assets/img/home-icons/bundle.png"
              :class="`${componentname == 'ShopBundle' ? 'active' : ''}`"
              alt="StudentProfile"
            />
          </div>
          <div @click="moveToComponent('SelfTest')">
            <img
              src="@/assets/img/home-icons/selftest.png"
              :class="`${componentname == 'SelfTest' ? 'active' : ''}`"
              alt="selftest"
            />
          </div>

          <div @click="moveToComponent('ClassRoom')">
            <img
              src="@/assets/img/home-icons/class.png"
              :class="`${componentname == 'ClassRoom' ? 'active' : ''}`"
              alt="class"
            />
          </div>
          <div @click="moveToComponent('ShopBookList')">
            <img
              src="@/assets/img/home-icons/book.png"
              :class="`${componentname == 'ShopBookList' ? 'active' : ''}`"
              alt="class"
            />
          </div>
          <div @click="moveToComponent('ContactBackup')">
            <img
              src="@/assets/img/home-icons/support.png"
              :class="`${componentname == 'ContactBackup' ? 'active' : ''}`"
              alt="backup"
            />
          </div>
          <div @click="moveToComponent('contactUs')">
            <img
              src="@/assets/img/home-icons/contact-us.png"
              :class="`${componentname == 'contactUs' ? 'active' : ''}`"
              alt="backup"
            />
          </div>
          <div @click="moveToComponent('studentShop')">
            <img
              :class="`${componentname == 'studentShop' ? 'active' : ''}`"
              src="@/assets/img/home-icons/shop.png"
              alt="shop"
            />
          </div>
          <div @click="moveToComponent('MyProfile')">
            <img
              src="@/assets/img/home-icons/profile.png"
              :class="`${componentname == 'MyProfile' ? 'active' : ''}`"
              alt="StudentProfile"
            />
          </div>
        </div>
      </aside>
      <img src="@/assets/img/footer-image@2x.png" alt="footer" class="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { computed, defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const componentname = computed(() => {
      return route.name;
    });

    const moveToComponent = (componentName: string) => {
      if (componentName == 'ShopBookList') {
        router.push({
          name: componentName,
          params: { id: '627b5419c6a709fd06348039' }
        });
        return;
      } else {
        router.push({ name: componentName });
      }
    };

    return { moveToComponent, componentname };
  }
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: IRANSans;
  padding-top: 6vh;
  z-index: 10;

  .wrapper {
    min-width: 18rem;
    max-width: 20rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer {
    max-width: 12rem;
    margin-top: 1rem;
  }
}
aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: white;
  padding: 1rem;
  border-bottom-left-radius: 60px;
  border-bottom-right-radius: 60px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  .header {
    max-width: 20rem;
    object-fit: contain;
    border-bottom: solid 1px #cfcfcf;
    padding: 1rem;
    &:hover {
      cursor: pointer;
      transform: scale(1.05);
    }
  }

  .cart-container {
    width: 100%;
    height: 100%;
    margin: 0.25rem auto;
    display: grid;
    grid-template-columns: repeat(2, 35%);
    align-content: center;
    justify-content: center;
    grid-gap: 0.75rem;
    .Cart {
      img {
        max-width: 100%;
        object-fit: cover;
      }
      .active {
        border-radius: 50%;
        border: 2px solid #d21921;
      }
    }

    .Duel {
      background: #efefef;
      border: 1px solid #b1b1b123;
      box-shadow: 0 5px 8px -3px gray;
      border-radius: 50%;
      aspect-ratio: 1;

      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      h4 {
        font-size: 0.65rem;
        font-weight: bold;
      }

      img {
        width: 50%;
        max-width: 100%;
        object-fit: cover;
        margin-bottom: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>

<template>
  <footer v-if="mobile" class="mobile-only">
    <div @click="$router.push({ name: 'ClassRoom' })">
      <img
        src="@/assets/img/one-lesson.png"
        :class="`${$route.name == 'ClassRoom' ? 'active' : ''}`"
        alt="backup"
      />
    </div>
    <div
      @click="
        $router.push({
          name: 'ShopBookList',
          params: { id: '627b5419c6a709fd06348039' }
        })
      "
    >
      <img
        src="@/assets/img/home-icons/home-page/book.png"
        :class="`${$route.name == 'ShopBookList' ? 'active' : ''}`"
        alt="backup"
      />
    </div>
    <div @click="$router.push({ name: 'ShopBundle' })">
      <img
        :class="`${$route.name == 'ShopBundle' ? 'active' : ''}`"
        src="@/assets/img/full-bundle.png"
        alt="shop"
      />
    </div>
    <div @click="$router.push({ name: 'SelfTest' })">
      <img
        src="@/assets/img/home-icons/home-page/selftest.png"
        :class="`${$route.name == 'SelfTest' ? 'active' : ''}`"
        alt="StudentProfile"
      />
    </div>
  </footer>
</template>
<style scoped lang="scss">
// @import '@/css-variable/Global.scss';
.mobile-only {
  width: 90%;
  margin: 1rem auto;
  // box-shadow: 0px -2px 4px rgba(227, 227, 227, 0.25), 0px 2px 4px #e3e3e3;
  display: flex;

  gap: 1rem;
  justify-content: space-between;
  background-color: white;
  padding: 1rem;
  border-radius: 20px;

  img {
    width: 3rem;
  }
}
</style>

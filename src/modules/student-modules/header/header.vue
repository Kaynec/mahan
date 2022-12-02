<template>
  <header>
    <img alt="logo" src="@/assets/img/logo-mahan.png" />
    <div class="user-part">
      <span class="points">
        امتیاز شما:
        {{ toPersianNumbers(`${point}`) }}
      </span>

      <router-link to="/student/home" style="text-decoration: none">
        <div class="home">
          <i class="fa fa-home" aria-hidden="true"></i>
        </div>
      </router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { store } from '@/store';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { baseUrl } from '@/api/apiclient';

export default defineComponent({
  setup() {
    const currentUser = ref(store.getters.getCurrentStudent);
    let imageUrl =
      'https://images.vexels.com/media/users/3/129616/isolated/preview/fb517f8913bd99cd48ef00facb4a67c0-businessman-avatar-silhouette-by-vexels.png';
    if (currentUser.value && currentUser.value.profileImage) {
      imageUrl = `${baseUrl}student/getProfileImage/${currentUser.value.profileImage}`;
    }

    const point = ref('0');
    if (currentUser.value && currentUser.value.point)
      point.value = currentUser.value.point;

    return { currentUser, toPersianNumbers, point, store, imageUrl };
  }
});
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.09);
  background-color: white;
  // height: 8vh;
  max-height: 10vh;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  z-index: 2;
  position: fixed; /* Set the navbar to fixed position */
  top: 0; /* Position the navbar at the top of the page */
  width: 100%; /* Full width */
  img.logo-mahan {
    width: clamp(5.5rem, 7rem, 120px);
    object-fit: cover;
    background: rgba(0, 0, 0, 0.09);
    // max-width: 120px;
  }

  .home {
    background-color: red;
    border-radius: 0.5rem;
    aspect-ratio: 1;
    color: white;
    font-size: 1.5rem;
    width: 2.5rem;
    height: 2.5rem;
    display: grid;
    place-content: center;
  }

  .user-part {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    gap: 0.3rem;
    margin-left: 0.5rem;
    z-index: 2;

    .points {
      font-family: IRANSans;
      color: #fff;
      font-size: 11px;
      font-weight: bold;
    }
    .profile-image {
      width: clamp(2.1rem, 3rem, 4.1rem);
      height: clamp(2.1rem, 3rem, 4.1rem);
      aspect-ratio: 1;
      margin: 0 10px 0 0;
      border-radius: 50%;
      border: solid 2px #ddd;
      object-fit: contain;
    }
  }
}
</style>

<template>
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <router-link to="/" class="brand-link">
      <img
        src="@/assets/img/logo.png"
        alt="AdminLTE Logo"
        class="brand-image img-circle elevation-3"
        style="opacity: 0.8"
      />
      <span class="brand-text font-weight-light">موسسه ماهان</span>
    </router-link>

    <div class="sidebar">
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="imgg">
          <img
            src="@/assets/img/default-profile.png"
            class="img-circle elevation-2"
            alt="User Image"
          />
        </div>
        <div class="info">
          <router-link to="/admin/profile" class="d-block">{{
            currentUser.firstname + ' ' + currentUser.lastname
          }}</router-link>
        </div>
      </div>

      <nav class="mt-2">
        <ul
          class="nav nav-pills nav-sidebar flex-column"
          data-widget="treeview"
          role="menu"
          data-accordion="false"
        >
          <li v-for="(menu, index) in getMenus" :key="index" class="nav-item">
            <router-link
              :to="menu.url"
              class="nav-link"
              exact
              exact-active-class="active"
            >
              <!-- <i class="nav-icon fas fa-tachometer-alt"></i> -->
              <p>{{ menu.name }}</p>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useAdminStore } from '@/store';
import { menus } from '@/api/const';

@Options({})
export default class MenuSidebar extends Vue {
  get currentUser(): any | null {
    return useAdminStore().getters.getCurrentUser;
  }

  get getMenus(): any[] {
    return menus.filter((p) =>
      this.currentUser?.access.some((s) => s.menuCode == p.code)
    );
  }
}
</script>

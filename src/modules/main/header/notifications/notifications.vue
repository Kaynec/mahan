<template>
  <li class="nav-item dropdown" ref="dropdown">
    <button class="nav-link" data-toggle="dropdown" @click="toggleDropdown">
      <i class="far fa-bell"></i>
      <span class="badge badge-warning navbar-badge">15</span>
    </button>
    <div
      class="dropdown-menu dropdown-menu-lg dropdown-menu-right"
      :class="{ show: isDropdownOpened }"
    >
      <span class="dropdown-item dropdown-header">15 Notifications</span>
      <div class="dropdown-divider"></div>
      <a href="#" class="dropdown-item">
        <i class="fas fa-envelope mr-2"></i> 4 new messages
        <span class="float-right text-muted text-sm">3 mins</span>
      </a>
      <div class="dropdown-divider"></div>
      <a href="#" class="dropdown-item">
        <i class="fas fa-users mr-2"></i> 8 friend requests
        <span class="float-right text-muted text-sm">12 hours</span>
      </a>
      <div class="dropdown-divider"></div>
      <a href="#" class="dropdown-item">
        <i class="fas fa-file mr-2"></i> 3 new reports
        <span class="float-right text-muted text-sm">2 days</span>
      </a>
      <div class="dropdown-divider"></div>
      <a href="#" class="dropdown-item dropdown-footer"
        >See All Notifications</a
      >
    </div>
  </li>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Notifications extends Vue {
  public isDropdownOpened = false;

  public mounted(): void {
    document.addEventListener('click', this.documentClick);
  }

  public unmounted(): void {
    document.removeEventListener('click', this.documentClick);
  }

  public toggleDropdown() {
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  private documentClick(event: Event) {
    const el: HTMLElement = this.$refs.dropdown as HTMLElement;
    const target: HTMLElement = event.target as HTMLElement;
    if (el !== target && !el.contains(target)) {
      this.isDropdownOpened = false;
    }
  }
}
</script>

<template>
  <li class="nav-item dropdown" ref="dropdown">
    <button class="nav-link" data-toggle="dropdown" @click="toggleDropdown">
      <i class="flag-icon flag-icon-us"></i>
    </button>
    <div
      class="dropdown-menu dropdown-menu-right p-0"
      :class="{ show: isDropdownOpened }"
    >
      <a href="#" class="dropdown-item active">
        <i class="flag-icon flag-icon-us mr-2"></i> English
      </a>
      <a href="#" class="dropdown-item">
        <i class="flag-icon flag-icon-de mr-2"></i> German
      </a>
      <a href="#" class="dropdown-item">
        <i class="flag-icon flag-icon-fr mr-2"></i> French
      </a>
      <a href="#" class="dropdown-item">
        <i class="flag-icon flag-icon-es mr-2"></i> Spanish
      </a>
    </div>
  </li>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Languages extends Vue {
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

  public documentClick(event: Event) {
    const el: HTMLElement = this.$refs.dropdown as HTMLElement;
    const target: HTMLElement = event.target as HTMLElement;
    if (el !== target && !el.contains(target)) {
      this.isDropdownOpened = false;
    }
  }
}
</script>

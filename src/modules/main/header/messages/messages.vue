<template>
  <li class="nav-item dropdown" ref="dropdown">
    <button class="nav-link" @click="toggleDropdown">
      <i class="far fa-comments"></i>
      <span class="badge badge-danger navbar-badge">3</span>
    </button>
    <div
      class="dropdown-menu dropdown-menu-lg dropdown-menu-right"
      :class="{ show: isDropdownOpened }"
    >
      <a href="#" class="dropdown-item">
        <!-- Message Start -->
        <div class="media">
          <img
            src="../../../../assets/img/default-profile.png"
            alt="User Avatar"
            class="img-size-50 mr-3 img-circle"
          />
          <div class="media-body">
            <h3 class="dropdown-item-title">
              Brad Diesel
              <span class="float-right text-sm text-danger"
                ><i class="fas fa-star"></i
              ></span>
            </h3>
            <p class="text-sm">Call me whenever you can...</p>
            <p class="text-sm text-muted">
              <i class="far fa-clock mr-1"></i> 4 Hours Ago
            </p>
          </div>
        </div>
        <!-- Message End -->
      </a>
      <div class="dropdown-divider"></div>
      <a href="#" class="dropdown-item">
        <!-- Message Start -->
        <div class="media">
          <img
            src="../../../../assets/img/default-profile.png"
            alt="User Avatar"
            class="img-size-50 img-circle mr-3"
          />
          <div class="media-body">
            <h3 class="dropdown-item-title">
              John Pierce
              <span class="float-right text-sm text-muted"
                ><i class="fas fa-star"></i
              ></span>
            </h3>
            <p class="text-sm">I got your message bro</p>
            <p class="text-sm text-muted">
              <i class="far fa-clock mr-1"></i> 4 Hours Ago
            </p>
          </div>
        </div>
        <!-- Message End -->
      </a>
      <div class="dropdown-divider"></div>
      <a href="#" class="dropdown-item">
        <!-- Message Start -->
        <div class="media">
          <img
            src="../../../../assets/img/default-profile.png"
            alt="User Avatar"
            class="img-size-50 img-circle mr-3"
          />
          <div class="media-body">
            <h3 class="dropdown-item-title">
              Nora Silvester
              <span class="float-right text-sm text-warning"
                ><i class="fas fa-star"></i
              ></span>
            </h3>
            <p class="text-sm">The subject goes here</p>
            <p class="text-sm text-muted">
              <i class="far fa-clock mr-1"></i> 4 Hours Ago
            </p>
          </div>
        </div>
        <!-- Message End -->
      </a>
      <div class="dropdown-divider"></div>
      <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>
    </div>
  </li>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Messages extends Vue {
  private isDropdownOpened = false;

  public mounted(): void {
    document.addEventListener('click', this.documentClick);
  }

  public unmounted(): void {
    document.removeEventListener('click', this.documentClick);
  }

  private toggleDropdown() {
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

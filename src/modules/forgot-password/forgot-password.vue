<template>
  <div class="login-box">
    <div class="card card-outline card-primary">
      <div class="card-header text-center">
        <a href="../../index2.html" class="h1"><b>Admin</b>LTE</a>
      </div>
      <div class="card-body">
        <p class="login-box-msg">
          You forgot your password? Here you can easily retrieve a new password.
        </p>
        <form>
          <div class="input-group mb-3">
            <input type="email" class="form-control" placeholder="Email" />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-envelope"></span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <button type="submit" class="btn btn-primary btn-block">
                Request new password
              </button>
            </div>
            <!-- /.col -->
          </div>
        </form>
        <p class="mt-3 mb-1">
          <router-link to="/login">Login</router-link>
        </p>
      </div>
      <!-- /.login-card-body -->
    </div>
  </div>
  <!-- /.login-box -->
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class ForgotPassword extends Vue {
  private appElement: HTMLElement | null = null;

  public mounted(): void {
    this.appElement = document.getElementById('app') as HTMLElement;
    this.appElement.classList.add('login-page');
  }

  public unmounted(): void {
    (this.appElement as HTMLElement).classList.remove('login-page');
  }
}
</script>

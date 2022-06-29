<template>
  <div class="register-box">
    <div class="card card-outline card-primary">
      <div class="card-header text-center">
        <a href="../../index2.html" class="h1"><b>Admin</b>LTE</a>
      </div>
      <div class="card-body">
        <p class="login-box-msg">Register a new membership</p>

        <form action="../../index.html" method="post">
          <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Full name" />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-user"></span>
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <input type="email" class="form-control" placeholder="Email" />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-envelope"></span>
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <input
              type="password"
              class="form-control"
              placeholder="Password"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-lock"></span>
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <input
              type="password"
              class="form-control"
              placeholder="Retype password"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-lock"></span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-8">
              <div class="icheck-primary">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="terms"
                  value="agree"
                />
                <label for="agreeTerms">
                  I agree to the <a href="#">terms</a>
                </label>
              </div>
            </div>
            <!-- /.col -->
            <div class="col-4">
              <button
                type="submit"
                @click="login"
                class="btn btn-primary btn-block"
              >
                Register
              </button>
            </div>
            <!-- /.col -->
          </div>
        </form>

        <div class="social-auth-links text-center">
          <button @click="loginByFacebook" class="btn btn-block btn-primary">
            <i class="fab fa-facebook mr-2"></i>
            Sign up using Facebook
          </button>
          <button @click="loginByGoogle" class="btn btn-block btn-danger">
            <i class="fab fa-google-plus mr-2"></i>
            Sign up using Google+
          </button>
        </div>

        <router-link to="/login" class="text-center">
          I already have a membership
        </router-link>
      </div>
      <!-- /.form-box -->
    </div>
    <!-- /.card -->
  </div>
  <!-- /.register-box -->
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Register extends Vue {
  private appElement: HTMLElement | null = null;

  public mounted(): void {
    this.appElement = document.getElementById('app') as HTMLElement;
    this.appElement.classList.add('register-page');
  }

  public unmounted(): void {
    (this.appElement as HTMLElement).classList.remove('register-page');
  }

  public login(): void {
    this.$router.push('/');
  }

  public loginByFacebook(): void {
    this.$router.push('/');
  }

  public loginByGoogle(): void {
    this.$router.push('/');
  }
}

</script>
<template>
  <main class="splash animate__animated animate__fadeOut">
    <img src="../assets/img/logo@3x.png" alt="Logo" class="logo" />
    <br />
    <footer>
      <img
        src="../assets/img/footer-image@3x.png"
        alt="footer logo"
        class="footer"
      />
      <div class="skewed"></div>
    </footer>
  </main>
</template>

<style scoped>
.splash {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  max-width: 100%;
  overflow: hidden;
}
img {
  max-width: 350px;
}

.logo {
  margin-top: 20%;
}
.footer {
  max-width: 185px;
}
footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
footer .skewed {
  background: #000;
  width: 100%;
  height: 15%;
  max-height: 65px;
  height: 60px;
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

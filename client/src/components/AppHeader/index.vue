<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-transparent nav-down" color-on-scroll="500">
    <div class="container">
      <div class="navbar-translate">
        <div class="navbar-header">
          <a class="navbar-brand"><span style="color: #F03434">Coin</span><span  style="color: #fff">Exchange</span></a>
        </div>
        <button class="navbar-toggler navbar-burger" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-bar"/>
          <span class="navbar-toggler-bar"/>
          <span class="navbar-toggler-bar"/>
        </button>
      </div>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <!-- <a class="nav-link" href="examples/exchange.html" data-scroll="true"></a> -->
          </li>
          <!-- <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-toggle="dropdown"></a>
            <ul class="dropdown-menu dropdown-menu-right dropdown-danger">
              <a class="dropdown-item" href="">
              <i class="nc-icon nc-tile-56"/>&nbsp; Deposit</a>
              <a class="dropdown-item" href="">
              <i class="nc-icon nc-tile-56"/>&nbsp; Withdraw</a>
            </ul>
          </li> -->
          <li class="nav-item">
            <a class="btn btn-danger btn-sm" href="">
              <i class="nc-icon nc-layout-11"/> Register
            </a>
          </li>
          <li class="nav-item">
            <a class="btn btn-danger btn-sm" href="">
              <i class="nc-icon nc-satisfied"/> Login
            </a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-toggle="dropdown">
            <i class="nc-icon nc-globe"/>VI</a>
            <ul class="dropdown-menu dropdown-menu-right dropdown-danger">
              <a class="dropdown-item" href="">
              <i class="nc-icon nc-basket"/>&nbsp; EN</a>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  computed: {
    ...mapGetters('session', ['isAuthenticated'])
  },

  methods: {
    ...mapActions('session', ['logout']),

    handleBtnSignUpClick() {
      this.$router.push('/register');
    },
    handleBtnLoginClick() {
      this.$router.push('/login');
    },
    handleBtnLogoutClick() {
      this.logout().then(() => this.$router.push('/login'));
    },
    handleBtnProfileClick() {
      this.$router.push('/profile');
    }
  }
};
</script>

<style scoped>
.navbar .navbar-brand {
  padding: 0 !important;
}
.navbar-brand {
  font-size: 18px !important;
}
</style>

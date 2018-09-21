<template>
  <footer class="footer footer-black">
    <div class="container">
      <div class="row">
        <nav class="footer-nav">
          <ul>
            <li>
              <a href="https://ltv.vn">LTV</a>
            </li>
            <li>
              <a href="https://blog.ltv.vn">Blog</a>
            </li>
            <li>
              <a href="https://ltv.vn/license">Licenses</a>
            </li>
          </ul>
        </nav>
        <div class="credits ml-auto">
          <span class="copyright">
            © {{fullYear}}, made with
            <i class="fa fa-heart heart"/> by LTV
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      fullYear: ''
    };
  },

  created() {
    this.fullYear = new Date().getFullYear();
  }
};
</script>

<style>
.footer-black {
  background: #2c2f34 !important;
}
</style>

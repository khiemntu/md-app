<template>
  <div class="presentation-page loading">
    <div class="wrapper">
      <router-view/>
    </div>
    <v-snackbar :timeout="3000" :color="snackbar.color" :multi-line="true" v-model="show" top right>
      <span class="m-snackbar-text">{{ snackbar.text }}</span>
      <v-btn dark flat icon @click.native="show = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',

  /**
   * Application created
   */
  computed: {
    ...mapState('global', ['snackbar']),
    show: {
      get() {
        return this.snackbar.show;
      },
      set() {
        this.resetMsg();
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions('global', ['resetMsg'])
  }
};
</script>

<style scoped>
/* .m-snackbar-text {
  letter-spacing: 1px;
} */
.presentation-page,
.wrapper {
  height: 100%;
}
</style>

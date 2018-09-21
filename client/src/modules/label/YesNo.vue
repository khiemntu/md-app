<template>
  <v-dialog
    v-model="dialog"
    width="600"
  >
    <v-card>
      <v-card-title class="headline">Do you wanna delete {{title}} ?</v-card-title>
      <v-card-text class="m-text">You can not rollback your action, so please check carefully before click agree.</v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn depressed color="error" @click.native="Click(0)">Cancel</v-btn>
        <v-btn depressed color="primary" @click.native="Click(1)">Agree</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'these items'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: ''
    };
  },
  watch: {
    show(val) {
      this.dialog = val;
    }
  },
  methods: {
    Click(num) {
      this.dialog = false;
      this.$emit('clickEvent', num);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-text {
  padding-top: 0;
  font-style: italic;
  opacity: 0.5;
}
</style>

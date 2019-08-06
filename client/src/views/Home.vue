<template>
  <div v-if="show" class="home">
    <b-alert variant="danger" :show="errorState">{{errorMessage}}</b-alert>
    <h1>Nestjs Typeorm Auth</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  validateToken,
  isVerified,
  getPayloadFromToken
} from "../utils/userUtils";
import { Payload } from "../types/payload";

@Component({})
export default class Home extends Vue {
  show = false;
  errorState = 0;
  errorMessage = "Please verify your email address";

  async mounted() {
    const state = await validateToken(localStorage.token);
    if (state == false) this.$router.push({ name: "login" });
    else this.show = true;

    const payload: Payload = await getPayloadFromToken(localStorage.token);
    const verified = await isVerified(payload.email);
    if (!verified) {
      this.errorState += 6;
    }
  }
}
</script>

<style lang="scss">
#app {
  background: #fff;
}
</style>

<template>
  <div v-if="show" class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { validateToken } from '../utils/checkToken'

@Component({})
export default class Home extends Vue {
  show = false

  async mounted() {
    const state = await validateToken(localStorage.token);
    if(state == false) this.$router.push({ name: 'login'});
    else this.show = true;
  }
}
</script>

<style lang="scss">

</style>

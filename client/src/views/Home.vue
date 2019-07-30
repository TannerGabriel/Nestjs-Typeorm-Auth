<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { validateToken } from '../utils/checkToken'

@Component({})
export default class Home extends Vue {
  async mounted() {
    console.log(localStorage.token)
    const state = await validateToken(localStorage.token)
    console.log(state)
  }
}
</script>

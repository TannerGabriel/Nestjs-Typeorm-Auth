<template>
  <section>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-item>
          <router-link class="nav-link" to="/">Home</router-link>
        </b-nav-item>

        <b-nav-item-dropdown class="nav-link" text="File" right>
          <b-dropdown-item href="#">New</b-dropdown-item>
          <b-dropdown-item href="#">Open</b-dropdown-item>
          <b-dropdown-item href="#">Save</b-dropdown-item>
          <b-dropdown-item href="#">Save as</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown class="nav-link" text="Edit" right>
          <b-dropdown-item href="#">Function</b-dropdown-item>
          <b-dropdown-item href="#">Variable</b-dropdown-item>
          <b-dropdown-item href="#">Remove</b-dropdown-item>
          <b-dropdown-item href="#">Drop Results</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item>
          <router-link class="nav-link" to="/profile">Profile</router-link>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Navbar extends Vue {}
</script>


<style lang="scss">
a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.5);
}
</style>

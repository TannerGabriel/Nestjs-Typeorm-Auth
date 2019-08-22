<template>
  <section class="settings">
    <b-alert variant="success" :show="success">Successfully updated account</b-alert>
    <b-alert variant="danger" :show="errorState">{{errorMessage}}</b-alert>
    <b-container class="settings-container">
      <h1 class="page-heading">Your settings</h1>

      <b-nav tabs>
        <b-nav-item @click="makeActive('Profile')">Profile</b-nav-item>
        <b-nav-item @click="makeActive('Password')">Password</b-nav-item>
      </b-nav>

      <b-form @submit="onSubmit" v-if="show && active == 'Profile'">
        <b-form-group id="name" label-for="name" label="Name">
          <b-form-input id="name" v-model="form.username" type="text" required></b-form-input>
        </b-form-group>

        <b-form-group id="email" label-for="email" label="Email">
          <b-form-input id="email" v-model="form.email" type="email" required></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Save</b-button>
      </b-form>

      <b-form @submit="onSubmit" v-if="show && active == 'Password'">
        <b-form-group id="passwordGroup" label-for="password" label="Password">
          <b-input
            type="password"
            id="password"
            aria-describedby="password-help-block"
            required
            placeholder="Password"
            v-model="passwordForm.password"
          ></b-input>
        </b-form-group>

        <b-form-group id="secondPasswordGroup" label-for="secondPassword" label="Confirm password">
          <b-input
            type="password"
            id="secondPassword"
            aria-describedby="password-help-block"
            required
            placeholder="Password"
            v-model="passwordForm.secondPassword"
          ></b-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Save</b-button>
      </b-form>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios from "axios";
import { Payload } from "../types/payload";
import { User } from "../types/user";

import {
  validateToken,
  getUserInformation,
  getPayloadFromToken
} from "../utils/userUtils";

@Component({
  components: {}
})
export default class Profile extends Vue {
  form = {
    username: "",
    email: ""
  };
  passwordForm = {
    password: "",
    secondPassword: ""
  };
  show = true;
  success = 0;
  errorState = 0;
  errorMessage = "";
  user: User = {
    _id: "",
    username: "",
    email: "",
    password: ""
  };
  active: string = "Profile";

  onSubmit(evt: Event) {
    evt.preventDefault();

    let data;

    if (this.active === "Profile") {
      data = this.form;
    } else if (
      this.active === "Password" &&
      this.passwordForm.password === this.passwordForm.secondPassword
    ) {
      data = this.passwordForm;
    } else if (this.active === "Password") {
      this.errorMessage = "Passwords didn't match";
      this.errorState += 4;
      return undefined;
    }

    axios
      .put(`http://localhost:3000/users/${this.user._id}`, data)
      .then(response => {
        if (response.status == 200) {
          this.success += 2;
        } else {
          alert("Wrong credentials");
        }
      })
      .catch(error => {
        this.errorMessage = `${error.message}: ${error.response.data.message}`;
        this.errorState += 4;
      });
  }

  async mounted() {
    const state = await validateToken(localStorage.token);
    if (state != true) this.$router.push({ name: "login" });
    else {
      const payload: Payload = await getPayloadFromToken(localStorage.token);
      this.user = await getUserInformation(payload.email);
      this.form.email = this.user.email;
      this.form.username = this.user.username;
    }
  }

  makeActive(navItemId: string) {
    this.active = navItemId;
  }
}
</script>

<style lang="scss">
#app {
  background: #fff;
}
</style>

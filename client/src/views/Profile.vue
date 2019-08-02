<template>
  <section class="settings">
    <b-alert variant="success" :show="success">Successfully updated account</b-alert>
    <b-alert variant="danger" :show="errorState">{{errorMessage}}</b-alert>
    <b-container class="settings-container">
      <h1 class="page-heading">Your settings</h1>
      <b-form @submit="onSubmit" v-if="show">
        <b-form-group id="name" label-for="name" label="Name">
          <b-form-input id="name" v-model="form.name" type="name" required></b-form-input>
        </b-form-group>

        <b-form-group id="name" label-for="email" label="Email">
          <b-form-input id="email" v-model="form.email" type="email" required></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
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
export default class Login extends Vue {
  form = {
    name: "",
    email: "",
    password: ""
  };
  show = true;
  success = 0;
  errorState = 0;
  errorMessage = "";
  user: User;

  onSubmit(evt: Event) {
    evt.preventDefault();
    axios
      .put(`http://localhost:3000/users/${this.user._id}`, this.form)
      .then(response => {
        if (response.status == 201) {
          this.success = 2;
        } else {
          alert("Wrong credentials");
        }
      })
      .catch(error => {
        this.errorMessage = `${error.message}: ${error.response.data.message}`;
        this.errorState = 4;
      });
  }

  async mounted() {
    const state = await validateToken(localStorage.token);
    if (state != true) this.$router.push({ name: "login" });
    else {
      const payload: Payload = await getPayloadFromToken(localStorage.token);
      this.user = await getUserInformation(payload.email, localStorage.token);
      this.form.email = this.user.email;
    }
  }
}
</script>


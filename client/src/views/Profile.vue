<template>
  <section class="settings">
    <b-alert variant="success" :show="success">Successfully updated account</b-alert>
    <b-alert variant="danger" :show="errorState">{{errorMessage}}</b-alert>
    <b-container class="settings-container">
      <b-form @submit="onSubmit" v-if="show">
        <b-form-group id="input-group-1" label-for="settings">
          <h1>Your settings</h1>
          <p>Change the details of your profile</p>
          <b-form-input id="name" v-model="form.name" type="name" required placeholder="Full name"></b-form-input>
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter email"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios from "axios";
import { validateToken } from "../utils/userUtils";

@Component({
  components: {}
})
export default class Login extends Vue {
  form = {
    email: "",
    password: ""
  };
  show = true;
  success = 0;
  errorState = 0;
  errorMessage = "";
  userId = "";

  onSubmit(evt: Event) {
    evt.preventDefault();
    axios
      .put(`http://localhost:3000/users/${this.userId}`, this.form)
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
    }
  }
}
</script>


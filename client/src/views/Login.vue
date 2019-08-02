<template>
  <section class="auth">
    <b-alert variant="success" :show="success">Successfully logged in</b-alert>
    <b-alert variant="danger" :show="errorState">{{errorMessage}}</b-alert>
    <b-container class="auth-container">
      <b-form @submit="onSubmit" v-if="show">
        <b-form-group id="input-group-1" label="Login" label-for="login">
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter email"
          ></b-form-input>
          <b-input
            type="password"
            id="text-password"
            aria-describedby="password-help-block"
            required
            placeholder="Password"
            v-model="form.password"
          ></b-input>
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

  onSubmit(evt: Event) {
    evt.preventDefault();
    axios
      .post("http://localhost:3000/auth", this.form)
      .then(response => {
        if (response.status == 201) {
          this.success = 2;
          setTimeout(() => {
            this.$router.push({ name: "home" });
            localStorage.token = response.data.token;
          }, 2000);
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
    if (state == true) this.$router.push({ name: "home" });
  }
}
</script>

<style lang="scss">
.auth-container {
  width: 400px;
  margin-top: 3rem;
  text-align: center;
  margin: 8rem auto 0;
  box-shadow: 0 1rem 1rem 0 rgba(0, 0, 0, 0.15);
  background: #fff;
  position: relative;
  padding: 6rem 4rem;
}

body {
  background: #607d8b;
}

input {
  margin: 0.5rem;
}

label {
  margin-bottom: 1rem;
}
</style>

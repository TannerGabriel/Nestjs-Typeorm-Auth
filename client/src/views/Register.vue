<template>
  <div class="about">
    <b-alert variant="success" :show="success">Successfully registered</b-alert>
    <b-container class="auth-container">
      <b-form @submit="onSubmit" v-if="show">
        <b-form-group id="register" label-for="Register" label="Register">
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
            placeholder="Password"
            v-model="form.password"
          ></b-input>
          <b-input id="input-2" v-model="form.name" required placeholder="Enter name"></b-input>
        </b-form-group>
        
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios from 'axios'

@Component({
  components: {},
})
export default class Register extends Vue {
  form = {
    email: "",
    password: "",
    name: ""
  };
  show = true;
  success = 0;

  onSubmit(evt: Event) {
    evt.preventDefault();
    axios.post('http://localhost:3000/users', this.form).then((response) => {
      this.success = 2
      console.log('test')
      setTimeout(() => {
        this.$router.push('/')
        localStorage.token = response.data.token.token 
      }, 2000);
    }).catch((error) => {
      alert(error)
    })
  }
}
</script>

<style lang="scss">
.auth-container {
  width: 400px;
  margin-top: 3rem;
  text-align: center;
  margin: 8rem auto 0;
  box-shadow: 0 1rem 1rem 0 rgba(0, 0, 0, .15);
  background: #fff;
  position: relative;
  padding: 6rem 4rem;
}

body {
  background: #607D8B;
}

input {
  margin: 0.5rem;
}

label {
  margin-bottom: 1rem;
}
</style>

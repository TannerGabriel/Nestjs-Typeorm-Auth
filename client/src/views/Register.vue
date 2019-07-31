<template>
  <div class="about">
    <b-alert variant="success" :show="success">Successfully registered</b-alert>
    <b-container>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="input-group-1" label="Email address:" label-for="input-1">
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter email"
          ></b-form-input>

          <label for="text-password">Password</label>
          <b-input
            type="password"
            id="text-password"
            aria-describedby="password-help-block"
            placeholder="Password"
            v-model="form.password"
          ></b-input>
        </b-form-group>

        <b-form @submit.stop.prevent></b-form>
        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
          <b-form-input id="input-2" v-model="form.name" required placeholder="Enter name"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
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

  onSubmit(evt) {
    evt.preventDefault();
    axios.post('http://localhost:3000/users', this.form).then((response) => {
      this.success = 2

      setTimeout(() => {
        this.$router.push('/')
        localStorage.token = response.data.token.token 
      }, 2000);
    }).catch((error) => {
      alert(error)
    })
  }

  onReset(evt) {
    evt.preventDefault()
    // Reset our form values
    this.form.email = ''
    this.form.name = ''
    this.form.password = ''

    this.show = false
    this.$nextTick(() => {
      this.show = true
    })
  }
}
</script>

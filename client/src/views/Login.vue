<template>
  <section>
    <b-alert variant="success" :show="success">Successfully logged in</b-alert>
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

        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios from "axios";

@Component({
  components: {}
})
export default class Login extends Vue {
   form = {
    email: "",
    password: "",
  };
  show = true;
  success = 0;

  onSubmit(evt) {
    evt.preventDefault();
    axios.post('http://localhost:3000/auth', this.form).then((response) => {
      if(response.status == 201) {
        this.success = 2
        setTimeout(() => {
          this.$router.push({ name: 'home'})
          localStorage.token = response.data.token 
        }, 2000);
      } else {
        alert("Wrong credentials")
      }
      
    }).catch((error) => {
      alert(error)
    })
  }

  onReset(evt) {
    evt.preventDefault()
    // Reset our form values
    this.form.email = ''
    this.form.password = ''

    this.show = false
    this.$nextTick(() => {
      this.show = true
    })
  }
}
</script>

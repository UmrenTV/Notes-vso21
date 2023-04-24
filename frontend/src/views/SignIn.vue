<!-- src/views/SignIn.vue -->
<script>
import { $http } from "../utils/http";
import bcrypt from "bcryptjs";

export default {
  data() {
    return {
      signInEmail: "",
      signInPassword: "",
      emailCheckResult: "",
    };
  },
  methods: {
    async signIn() {
      // Hash the password using bcrypt

      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(this.signInPassword, salt);

      // Send request to the backend
      $http
        .post(
          "/sessions",
          {
            email: this.signInEmail,
            password: this.signInPassword,
          },
          { disableErrorHandling: true }
        )
        .then((response) => {
          console.log("Logged in with session ID: ", response.sessionId);
          localStorage.setItem("sessionId", response.sessionId);
          this.$router.push("/");
        })
        .catch((response) => {
          alert(response.body.message);
        });
    },
    checkEmail() {
      // If the email is empty, don't send a request
      if (!this.signInEmail) {
        this.emailCheckResult = "";
        return;
      }

      // Send a POST /users/check-email request to the backend
      $http
        .post(
          "/users/check-email",
          {
            email: this.signInEmail,
          },
          { disableErrorHandling: true }
        )
        .then((response) => {
          this.emailCheckResult = "";
        })
        .catch((response) => {
          this.emailCheckResult = response.body.error;
        });
    },
  },
};
</script>

<template>
  <div>
    <div>
      <h1>Sign In</h1>

      <!-- Email -->
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <!-- <input
          type="text"
          name="email"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
          v-on:keyup="checkEmail"
          v-model="signInEmail"
        /> -->
        <input
          type="text"
          name="email"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
          v-model="signInEmail"
        />
        <label class="label">
          <!-- Show red text if the email is already taken -->
          <span
            class="label-text-alt text-red-600"
            id="email-error"
            :class="{ invisible: emailCheckResult.length === 0 }"
          >
            {{ emailCheckResult }}.
          </span>
        </label>
      </div>

      <!-- Password -->
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">Password</span>
        </label>
        <input
          type="password"
          name="password"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
          v-model="signInPassword"
        />
        <label class="label">
          <!-- Show red text if the password is too short -->
          <span
            class="label-text-alt text-red-600"
            id="password-error"
            :class="{
              invisible: !(
                signInPassword.length > 0 && signInPassword.length < 8
              ),
            }"
            >Password must be at least 8 characters long</span
          >
        </label>
      </div>
    </div>
    <div class="h-30">&nbsp;</div>
    <button id="sign-in" class="btn btn-primary" @click="signIn">
      Sign In
    </button>
    <!-- Added this div to prevent the error "only one root element from Vue2" -->
  </div>
</template>

<style>
.invisible {
  visibility: hidden;
}
</style>

<template>
  <div id="app">
    <nav>
      <div class="signed-in" v-if="!getSessionId">
        <router-link to="/signup">Sign Up</router-link>
        <router-link to="/signin">Sign In</router-link>
      </div>
      <div class="signed-out" v-else>
        <a class="nav-link" @click="signOut">Sign Out</a>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>

<script>
import { $http } from "./utils/http";
export default {
  name: "App",
  methods: {
    signOut() {
      // do the signout method here.
      console.log("signout initiated");
      $http
        .delete(
          `/sessions`,
          {
            sessionId: this.getSessionId,
          },
          { disableErrorHandling: true }
        )
        .then(() => {
          localStorage.removeItem("sessionId");
          this.$store.commit("clearSessionId");
        })
        .catch((response) => {
          console.log(response);
          alert(response.body);
        });
    },
  },
  mounted() {
    const sessionId = localStorage.getItem("sessionId");
    // checking if it exists in local storage so we can set it in Vuex too.
    if (sessionId) {
      this.$store.commit("setSessionId", sessionId);
    } else {
      console.log("Session ID doesn't exist in localStorage, login please");
    }
  },
  computed: {
    getSessionId() {
      return this.$store.getters.getSessionId;
    },
  },
};
</script>

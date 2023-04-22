<template>
  <div id="app">
    <nav>
      <div class="signed-in" v-if="sessionId">
        <a class="nav-link" @click="signOut">Sign Out</a>
      </div>
      <div class="signed-out" v-else>
        <router-link to="/signup">Sign Up</router-link>
        <router-link to="/signin">Sign In</router-link>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>

<script>
import { $http } from "./utils/http";
export default {
  data() {
    return {
      sessionId: "",
    };
  },
  name: "App",
  methods: {
    signOut() {
      // do the signout method here.
      console.log("signout initiated");
      $http
        .delete(
          `/sessions`,
          {
            sessionId: this.sessionId,
          },
          { disableErrorHandling: true }
        )
        .then(() => {
          localStorage.removeItem("sessionId");
          this.$store.commit("clearSessionId");
          console.log("signed out");
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
      this.sessionId = sessionId;
      this.$store.commit("setSessionId", sessionId);
      console.log("Session ID has been set to ", sessionId);
    } else {
      console.log("Session ID doesn't exist in localStorage, login please");
    }

    // just random vuex verification for dev purposes
    const storeSessionId = this.$store.getters.getSessionId;
    console.log(
      `store has ${storeSessionId ? storeSessionId : "No session Id in Vuex"} `
    );
  },
};
</script>

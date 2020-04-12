<template>
  <div class="admin">
    <h1>Admin</h1>
    <div class="loggedout" v-if="!$store.getters.isAdmin">
      <label id="password" for="password">Super secret password</label>
      <input type="password" v-model="password" v-on:keyup.enter="authenticate">
      <button class="btn" v-on:click="authenticate" :disabled="!enabled">Log in</button>
    </div>
    <div class="loggedin" v-else>
      <p>You're already logged in!</p>
      <button class="logout btn" v-on:click="$store.commit('isNotAdmin')">Log out</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'admin',
  data() {
    return {
      password: '',
      now: new Date(),
    };
  },
  mounted() {
    setInterval(() => {
      this.now = new Date();
    }, 500);
  },
  computed: {
    enabled() {
      const state = this.$store.getters.authState;
      const diff = this.now.getTime() - state.time.getTime();
      return !this.$store.getters.isAdmin && diff > 1000 * state.tries * state.tries;
    },
  },
  methods: {
    authenticate() {
      if (this.enabled) {
        this.$store.dispatch('logIn', this.password);
        this.password = '';
      }
    },
  },
};
</script>

<style scoped>
label {
  margin-right: 1em;
}
</style>

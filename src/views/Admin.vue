<template>
  <div class="admin">
    <h1>Admin</h1>
    <label id="password" for="password">Super secret password</label>
    <input type="password" v-model="password">
    <button class="btn" v-on:click="authenticate" v-on:keyup.enter="authenticate">Log in</button>
  </div>
</template>

<script>
export default {
  name: 'admin',
  data() {
    return {
      password: '',
    };
  },
  methods: {
    authenticate() {

    },
  },
};
</script>

<style scoped>
label {
  margin-right: 1em;
}
</style>

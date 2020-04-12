<template>
  <div class="create">
    <h1>Create a new room</h1>
    <p>Think of a name for your room and create it. You can immediately start voting!</p>
    <div class="input">
      <input id="name" type="text" v-model="name" placeholder="room name" v-on:keyup.enter="create">
      <button class="btn" v-on:click="create" :disabled="!valid">Create</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'create',
  data() {
    return {
      name: '',
      description: '',
    };
  },
  computed: {
    valid() {
      return this.name && this.name.length < 10 && this.$store.getters.rooms.length < 10;
    },
  },
  methods: {
    create() {
      if (this.valid) {
        this.$socket.emit('create', this.name);
        this.$router.push(`/room/${this.name}`);
      }
    },
  },
};
</script>

<style scoped>
.input {
  margin: 1em;
}
</style>

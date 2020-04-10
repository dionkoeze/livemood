<template>
  <div class="create">
    <h1>Create a new room</h1>
    <p>Think of a name for your room and create it. You can immediately start voting!</p>
    <input id="name" type="text" v-model="name" placeholder="room name" v-on:keyup.enter="create">
    <button v-on:click="create" :disabled="!valid">Create</button>
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
      return this.name && this.name.length < 10;
    },
  },
  methods: {
    create() {
      console.log(this.invalid);
      if (this.valid) {
        this.$socket.emit('create', this.name);
        this.$router.push(`/room/${this.name}`);
      }
    },
  },
};
</script>

<style>

</style>

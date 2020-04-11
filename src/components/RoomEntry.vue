<template>
  <div class="room-entry btn" v-on:click="go">
    <span class="name">{{name}}</span>
    <span class="prtp">{{participants}}</span>
  </div>
</template>

<script>
export default {
  name: 'roomEntry',
  props: ['name', 'participants'],
  methods: {
    go() {
      this.$router.push(`/room/${this.name}`);
    },
  },
};
</script>

<style scoped>
a {
  display: inline-block;
  color: inherit;
  text-decoration: inherit;
  width: 5em;
  /* padding: .5em; */
}

.room-entry > .prtp {
  float: right;
}
</style>

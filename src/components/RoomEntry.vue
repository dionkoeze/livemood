<template>
  <div class="room-entry">
    <router-link :to="`/room/${name}`">{{name}}</router-link>
    <span>{{participants}}</span>
  </div>
</template>

<script>
export default {
  name: 'roomEntry',
  props: ['name', 'participants'],
};
</script>

<style scoped>
a {
  display: inline-block;
  color: inherit;
  text-decoration: inherit;
  width: 5em;
  padding: .5em;
}

.room-entry {
  margin: 0em .5em;
  border: .2em solid;
  border-radius: .5em;
}

.room-entry:hover {
  background-color: rgb(155, 155, 155);
}
</style>

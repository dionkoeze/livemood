<template>
  <div class="rooms-list">
    <h3>Rooms</h3>
    <button v-on:click="newRoom">New room</button>
    <div class="list">
      <RoomEntry
        v-for="room in $store.getters.rooms"
        :key="room.name"
        :name="room.name"
        :participants="room.participants"></RoomEntry>
    </div>
  </div>
</template>

<script>
import RoomEntry from '@/components/RoomEntry.vue';

export default {
  name: 'roomsList',
  components: {
    RoomEntry,
  },
  methods: {
    newRoom() {
      console.log('creating...');
      this.$router.push('/create');
    },
  },
};
</script>

<style scoped>
.rooms-list {
  background-color: rgb(202, 201, 201);
  height: 100vh;
}

button {
  margin: 1em;
}

.list {
  display: flex;
  flex-direction: column;
}
</style>

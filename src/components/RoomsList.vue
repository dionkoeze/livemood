<template>
  <div class="rooms-list">
    <h3>Rooms</h3>
    <div class="list">
      <RoomEntry
        v-for="room in $store.getters.rooms"
        :key="room.name"
        :name="room.name"
        :participants="room.participants"></RoomEntry>
    </div>
    <button class="btn" v-on:click="newRoom" :disabled="newRoomIsvalid">New room</button>
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
      this.$router.push('/create');
    },
  },
  computed: {
    newRoomIsvalid() {
      return this.$store.getters.rooms.length >= 10;
    },
  },
};
</script>

<style scoped>
.rooms-list {
  background-color: #F4D35E;
  height: 100vh;
  padding: 1em;
}

button {
  margin: 1em;
}

.list {
  display: flex;
  flex-direction: column;
}
</style>

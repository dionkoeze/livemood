<template>
  <div class="entry">
    <button class="room-entry btn" v-on:click="go">
      <span class="name">{{name}}</span>
      <span class="prtp">{{participants}}</span>
    </button>
    <ConfirmButton v-if="$store.getters.isAdmin" v-on:clicked="remove">X</ConfirmButton>
  </div>
</template>

<script>
import ConfirmButton from '@/components/ConfirmButton.vue';

export default {
  name: 'roomEntry',
  components: {
    ConfirmButton,
  },
  props: ['name', 'participants'],
  methods: {
    go() {
      this.$router.push(`/room/${encodeURIComponent(this.name)}`);
    },
    remove() {
      this.$socket.emit('removeRoom', this.name);
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.entry {
  display: flex;
  justify-content: space-between;
}

.room-entry {
  flex-grow: 1;
}

.room-entry > .prtp {
  float: right;
}

.delete-btn {
  background-color: #F95738;
}
</style>

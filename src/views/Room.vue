<template>
  <div class="room">
    <h1>{{$store.getters.room.name}}</h1>
    <p>{{$store.getters.room.participants}} participants are in this room.</p>
    <p class="explain">
      Click the button to tell how you're feeling. You can only vote once,
      but as your vote decreases over time you can vote again.<br>
      The bars on the right show everyone's votes. The votes you've casted at the moment
      are visible in the buttons.<br>
      Also try adding some new labels!
    </p>
    <div class="warn" v-if="$store.getters.room.TTL<150000">
      Room is almost closing! You have {{$store.getters.room.humanTTL}} min left.
      <button class="alive" v-on:click="keepAlive">Click to keep room alive</button>
    </div>
    <transition-group tag="div" name="list">
      <Vote
        v-for="vote in $store.getters.votes"
        :key="vote.text"
        :vote="vote"
        :max="$store.getters.room.participants"></Vote>
      <div key="zzzz">
        <input type="text" v-model="text" placeholder="new label" v-on:keyup.enter="create">
        <button v-on:click="create" :disabled="text===''">Add</button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import Vote from '@/components/Vote.vue';

export default {
  name: 'room',
  components: {
    Vote,
  },
  data() {
    return {
      text: '',
    };
  },
  mounted() {
    console.log(`created room comp ${this.$route.params.name}`);
    this.$store.dispatch('goToRoom', this.$route.params.name);
  },
  methods: {
    create() {
      if (this.text) {
        this.$socket.emit('vote', this.text);
        this.text = '';
      }
    },
    keepAlive() {
      this.$socket.emit('alive', this.$store.getters.room.name);
    },
  },
  watch: {
    $route() {
      console.log(`changed room to ${this.$route.params.name}`);
      this.$store.dispatch('goToRoom', this.$route.params.name);
    },
  },
  beforeDestroy() {
    console.log('leave room');
    this.$store.dispatch('goToRoom', '');
  },
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active,
.list-move {
  transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  transition-property: opacity, transform;
}

.list-enter {
  opacity: 0;
  transform: translateX(50px) scaleY(0.5);
}

.list-enter-to {
  opacity: 1;
  transform: translateX(0) scaleY(1);
}

.list-leave-active {
  position: absolute;
}

.list-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center top;
}

.warn {
  margin: 1em;
  padding: 1em;
  justify-content: center;
  color: red;
  background-color: rgb(241, 165, 165);
  border: .2em solid red;
  border-radius: 1em;
}

.alive {
  background-color: rgb(131, 192, 107);
  border: .2em solid green;
  border-radius: 1em;
}

.alive:hover {
  cursor: pointer;
}

.explain {
  font-size: .8em;
  width: 50%;
}
</style>

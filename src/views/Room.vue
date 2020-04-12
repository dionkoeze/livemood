<template>
  <div class="room">
    <h1>{{$store.getters.room.name}}</h1>
    <p>{{participants}} in this room.</p>
    <p class="explain">
      Click the orange button to tell how you're feeling. You can only vote once,
      but as your vote decreases over time you can vote again.<br>
      The bars on the right show everyone's votes. The votes you've casted at the moment
      are visible in the buttons.<br>
      Also try adding some new labels!
    </p>
    <div class="warn" v-if="$store.getters.room.TTL<150000">
      Room is almost closing! You have {{$store.getters.room.humanTTL}} min left.
      <button class="btn alive" v-on:click="keepAlive">Click to keep room alive</button>
    </div>
    <RoomSettings id="settings" v-if="$store.getters.isAdmin"></RoomSettings>
    <transition-group tag="div" name="list">
      <Vote
        v-for="vote in $store.getters.votes"
        :key="vote.text"
        :vote="vote"
        :max="maxVal"></Vote>
      <div key="zzzz">
        <input type="text" v-model="text" placeholder="new label" v-on:keyup.enter="create">
        <button class="btn" v-on:click="create" :disabled="addInvalid">Add</button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import Vote from '@/components/Vote.vue';
import RoomSettings from '@/components/RoomSettings.vue';

export default {
  name: 'room',
  components: {
    Vote,
    RoomSettings,
  },
  data() {
    return {
      text: '',
    };
  },
  mounted() {
    this.$store.dispatch('goToRoom', this.$route.params.name);
  },
  computed: {
    participants() {
      let result;
      if (this.$store.getters.room.participants === 0) {
        result = 'no participants are';
      } else if (this.$store.getters.room.participants === 1) {
        result = '1 participant is';
      } else {
        result = `${this.$store.getters.room.participants} participants are`;
      }
      return result;
    },
    maxVal() {
      const maxVotes = this.$store.getters.votes.reduce((acc, cur) => {
        if (cur.votes > acc) {
          return cur.votes;
        }
        return acc;
      }, 0);
      return Math.max(this.$store.getters.room.participants, maxVotes);
    },
    addInvalid() {
      return this.text === '' || this.$store.getters.votes.length > 9;
    },
  },
  methods: {
    create() {
      if (!this.addInvalid) {
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
      this.$store.dispatch('goToRoom', this.$route.params.name);
    },
  },
  beforeDestroy() {
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
  background-color: #EE964B;
  border: .2em solid #F95738;
  border-radius: 1em;
}

.alive {
  background-color: #F4D35E;
  color: #0D3B66;
  border: .2em solid #0D3B66;
  border-radius: 1em;
  margin: 1em;
}

.explain {
  font-size: .8em;
  width: 70%;
  margin: 2em;
}

#settings {
  margin: 1em;
}
</style>

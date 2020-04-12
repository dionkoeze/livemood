<template>
  <div id="vote">
    <div id="entry">
      <button
        class="btn vote-btn"
        v-on:click="submit"
        :style="{backgroundPosition: `${100-vote.mine*100}% 100%`}">{{vote.text}}</button>
        <!--  -->
      <div id="bar">
        <span :style="{width: `${vote.votes/max*100}%`}" id="filled"></span>
      </div>
      <ConfirmButton
        v-if="$store.getters.isAdmin"
        v-on:clicked="clear">clear</ConfirmButton>
      <ConfirmButton
        v-if="$store.getters.isAdmin && !vote.default"
        v-on:clicked="pin">pin</ConfirmButton>
      <ConfirmButton
        v-if="$store.getters.isAdmin && vote.default"
        v-on:clicked="unpin">unpin</ConfirmButton>
      <ConfirmButton
        v-if="$store.getters.isAdmin && !vote.default"
        v-on:clicked="remove">delete</ConfirmButton>
    </div>
  </div>
</template>

<script>
import ConfirmButton from '@/components/ConfirmButton.vue';

export default {
  name: 'vote',
  components: {
    ConfirmButton,
  },
  props: ['vote', 'max'],
  methods: {
    submit() {
      this.$socket.emit('vote', this.vote.text);
    },
    remove() {
      this.$socket.emit('removeText', this.$store.getters.room.name, this.vote.text);
    },
    clear() {
      this.$socket.emit('clear', this.$store.getters.room.name, this.vote.text);
    },
    pin() {
      this.$socket.emit('default', this.$store.getters.room.name, this.vote.text, true);
    },
    unpin() {
      this.$socket.emit('default', this.$store.getters.room.name, this.vote.text, false);
    },
  },
};
</script>

<style scoped>
#vote {
  display: flex;
  flex-direction: column;
}

#entry {
  display: flex;
  padding-bottom: .5em;
}

#bar {
  height: auto;
  width: 20em;
  background: #F4D35E;
  border-radius: .5em;
}

#filled {
  display: block;
  background-color: #0D3B66;
  position: relative;
  height: 100%;
  border-radius: .5em;;

  transition: width 1s;
}

.vote-btn {
  margin-right: 1em;
  width: 15em;
  padding: .2em;
  color: #0D3B66;
  /* background-color: #EE964B; */
  background: linear-gradient(to right, #F95738 50%, #EE964B 50%);
  background-size: 200% 100%;
  background-position: right bottom;
}
</style>

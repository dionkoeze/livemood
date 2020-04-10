<template>
  <div id="vote">
    <div id="entry">
      <button v-on:click="submit">{{vote.text}}</button>
      <div id="bar">
        <span :style="{width: vote.votes/max*100 + '%'}" id="filled"></span>
      </div>
      <!-- {{vote.votes / max}} -->
      <!-- {{vote.mine}} {{vote.votes}} -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'vote',
  props: ['vote', 'max'],
  methods: {
    submit() {
      this.$socket.emit('vote', this.vote.text);
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
  height: 1.5em;
  width: 20em;
  background: rgb(207, 207, 207);
  border-radius: .5em;
}

#filled {
  display: block;
  background-color: rgb(61, 92, 196);
  position: relative;
  height: 100%;
  border-radius: .5em;;

  transition: width 1s;
}

button {
  margin-right: 1em;
  width: 15em;
}
</style>

<template>
  <div id="vote">
    <div id="entry">
      <button class="btn vote-btn" v-on:click="submit">{{vote.text}}</button>
      <div id="bar">
        <span :style="{width: vote.votes/max*100 + '%'}" id="filled"></span>
      </div>
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
  height: 1.7em;
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
  background-color: #F95738;
}
</style>

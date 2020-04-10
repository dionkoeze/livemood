<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/admin">Admin</router-link>
    </div>
    <div id="side">
      <RoomsList></RoomsList>
    </div>
    <div id="main">
      <router-view/>
    </div>
  </div>
</template>

<script>
import RoomsList from '@/components/RoomsList.vue';

export default {
  name: 'app',
  components: {
    RoomsList,
  },
};
</script>

<style>
#app {
  display: grid;
  grid-template-columns: 20% auto;
  grid-template-rows: auto;
  grid-template-areas:
    "header header"
    "side main";
}

#nav {
  grid-area: header;
  background-color: rgb(185, 185, 255);
}

#side {
  grid-area: side;
}

#main {
  grid-area: main;
  margin: 2em;
}
</style>

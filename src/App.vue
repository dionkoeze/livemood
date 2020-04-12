<template>
  <div id="app">
    <div id="nav">
      <!-- <h5>Live mood meter</h5> -->
      <router-link class="btn nav-btn" to="/">Home</router-link>
      <router-link class="btn nav-btn" to="/admin">Admin</router-link>
      <transition name='name'>
        <span class="name" v-if="$route.name!=='Home'">
          <img v-if="$store.getters.isAdmin" id="lock" src="lock.png"/>
          Live mood meter
        </span>
      </transition>
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
* + * {
  font-family: 'B612', sans-serif;
  margin: 0;
  padding: 0;
}

.btn {
  margin: 0em .5em;
  padding: .4em;
  border: .2em solid;
  border-radius: .5em;
  transition: .3s;
  color: #FAF0CA;
  background-color: #0D3B66;
}

.btn:hover {
  /* background-color: rgb(155, 155, 155); */
  filter: brightness(140%);
  cursor: pointer;
}

.btn:disabled {
  filter: brightness(50%);
}
</style>

<style scoped>
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
  background-color: #EE964B;
  padding: 2em;
  height: 1.5em;
}

#side {
  grid-area: side;
}

#main {
  grid-area: main;
  background-color: #FAF0CA;
  padding: 2em;
}

.nav-btn {
  text-decoration: none;
  font-weight: bold;
  padding: .5em 1em;
}

.name {
  float: right;
  font-size: 1.3em;
}

.name-enter-active, .name-leave-active {
  transition: .5s;
}

.name-enter, .name-leave-to {
  opacity: 0;
}

#lock {
  height: 1em;
}
</style>

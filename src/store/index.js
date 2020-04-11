import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rooms: [],
    votes: [],
    myVotes: [],
    room: '',
    isAdmin: false,
    authCooldown: 0,
  },
  getters: {
    room(state) {
      // return state.room;
      const found = state.rooms.find((cur) => cur.name === state.room);
      if (found) {
        return found;
      }
      return {};
    },
    rooms(state) {
      return state.rooms;
    },
    votes(state) {
      // return state.votes;
      return state.votes.map((vote) => {
        let mine = state.myVotes.find((cur) => cur.text === vote.text);
        if (!mine) {
          mine = 0;
        } else {
          mine = mine.vote;
        }
        return {
          ...vote,
          mine,
        };
      });
    },
  },
  mutations: {
    changeRoom(state, name) {
      state.room = name;
    },
    setRooms(state, rooms) {
      state.rooms = rooms;
    },
    setVotes(state, votes) {
      state.votes = votes.sort((a, b) => b.votes - a.votes);
    },
    setMyVotes(state, myVotes) {
      state.myVotes = myVotes;
    },
  },
  actions: {
    goToRoom({ commit, state }, name) {
      if (state.room) {
        /* eslint-disable no-underscore-dangle */
        this._vm.$socket.emit('leave', state.room);
        /* eslint-enable no-underscore-dangle */
        commit('changeRoom', '');
      }
      if (name) {
        /* eslint-disable no-underscore-dangle */
        this._vm.$socket.emit('join', name);
        /* eslint-enable no-underscore-dangle */
        commit('changeRoom', name);
      }
    },
    socket_rooms({ commit }, rooms) {
      commit('setRooms', rooms);
    },
    socket_votes({ commit }, votes) {
      commit('setVotes', votes);
    },
    socket_myvotes({ commit }, myVotes) {
      commit('setMyVotes', myVotes);
    },
  },
  modules: {
  },
});

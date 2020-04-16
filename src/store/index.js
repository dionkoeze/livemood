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
    authTries: 0,
    authTime: new Date(),
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
    authState(state) {
      return {
        tries: state.authTries,
        time: state.authTime,
      };
    },
    isAdmin(state) {
      return state.isAdmin;
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
    isAdmin(state) {
      state.isAdmin = true;
    },
    isNotAdmin(state) {
      state.isAdmin = false;
    },
    logInAttempt(state) {
      state.authTime = new Date();
      state.authTries += 1;
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
    socket_votes({ commit, state }, votes) {
      if (votes.name === state.room) {
        commit('setVotes', votes.votes);
      }
    },
    socket_myvotes({ commit, state }, myVotes) {
      if (myVotes.name === state.room) {
        commit('setMyVotes', myVotes.votes);
      }
    },
    socket_authState({ commit }, authState) {
      if (authState.isAdmin) {
        commit('isAdmin');
      } else {
        commit('isNotAdmin');
      }
    },
    logIn({ commit }, password) {
      /* eslint-disable no-underscore-dangle */
      this._vm.$socket.emit('auth', password);
      /* eslint-enable no-underscore-dangle */
      commit('logInAttempt');
    },
  },
  modules: {
  },
});

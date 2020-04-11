import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(new VueSocketIO({
  debug: false,
  connection: 'localhost:3000',
  vuex: {
    store,
    actionPrefix: 'socket_',
    mutationPrefix: 'socket_',
  },
}));

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

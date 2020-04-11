import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Room from '../views/Room.vue';
import Create from '../views/Create.vue';
import Admin from '../views/Admin.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  },
  {
    path: '/create',
    name: 'Create',
    component: Create,
  },
  {
    path: '/room/:name',
    name: 'Room',
    component: Room,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

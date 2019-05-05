import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export function createRouter(): VueRouter {
  return new VueRouter({
    mode: 'history',
    base: '/wiki/Anno1800/',
    routes: [
      {
        path: '/',
        name: 'home',
        component: async () => import(/* webpackChunkName: "v-home" */ './views/home'),
      },
    ],
  });
}

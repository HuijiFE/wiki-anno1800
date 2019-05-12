import Vue from 'vue';
import VueRouter from 'vue-router';

import VLocalization from './views/localization';

Vue.use(VueRouter);

export function createRouter(): VueRouter {
  return new VueRouter({
    mode: 'history',
    base: '/wiki/Anno1800/',
    routes: [
      {
        path: '/',
        name: 'root',
        redirect: '/zh-CN',
      },
      {
        path: '/:language',
        name: 'localization',
        component: VLocalization,
        children: [
          {
            path: '',
            name: 'home',
            component: async () =>
              import(/* webpackChunkName: "v-home" */ './views/home'),
          },
        ],
      },
    ],
  });
}

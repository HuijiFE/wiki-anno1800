import Vue from 'vue';
import VueRouter from 'vue-router';
import { BASE_ROUTER_PATH } from '@src/utils';
import VLocalization from './views/localization';

Vue.use(VueRouter);

export function createRouter(): VueRouter {
  return new VueRouter({
    mode: 'history',
    base: BASE_ROUTER_PATH,
    routes: [
      {
        path: '/',
        name: 'root',
        redirect: '/zh-CN',
      },
      {
        path: '/:language',
        component: VLocalization,
        children: [
          {
            path: '',
            name: 'home',
            component: async () =>
              import(/* webpackChunkName: "v-home" */ './views/home'),
          },
          {
            path: ':genre(items|products)',
            name: 'items',
            component: async () =>
              import(/* webpackChunkName: "v-item" */ './views/item/items'),
          },
          {
            path: ':genre(item|product)/guid',
            name: 'item',
            component: async () =>
              import(/* webpackChunkName: "v-item" */ './views/item/item'),
          },
          {
            path: '*',
            name: 'test',
            component: async () =>
              import(/* webpackChunkName: "v-test" */ './views/test'),
          },
        ],
      },
    ],
  });
}

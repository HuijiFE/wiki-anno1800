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

          // Calculator
          {
            path: 'calculator',
            name: 'calculator',
            component: async () =>
              import(
                /* webpackChunkName: "v-calculator" */ './views/calculator/calculator'
              ),
          },

          // Simple
          {
            path: 'asset/:guid(\\d+)',
            name: 'asset',
            component: async () =>
              import(/* webpackChunkName: "v-simple" */ './views/simple/asset'),
          },
          {
            path: 'color-config',
            name: 'color-config',
            component: async () =>
              import(/* webpackChunkName: "v-simple" */ './views/simple/color-config'),
          },

          // Item & Product
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

          // Construction
          {
            path: 'construction',
            name: 'construction',
            component: async () =>
              import(
                /* webpackChunkName: "v-construction" */ './views/construction/construction'
              ),
          },

          // Debug
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

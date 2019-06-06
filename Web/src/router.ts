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
            name: 'home',
            path: '',
            alias: ['home'],
            component: async () =>
              import(/* webpackChunkName: "v-home" */ './views/home'),
          },

          // Calculator
          {
            name: 'calculator',
            path: 'calculator',
            component: async () =>
              import(
                /* webpackChunkName: "v-calculator" */ './views/calculator/calculator'
              ),
          },

          // Simple
          {
            name: 'asset',
            path: 'asset/:guid(\\d+)',
            component: async () =>
              import(/* webpackChunkName: "v-simple" */ './views/simple/asset'),
          },
          {
            name: 'color-config',
            path: 'color-config',
            component: async () =>
              import(/* webpackChunkName: "v-simple" */ './views/simple/color-config'),
          },

          // Item & Product
          {
            name: 'items',
            path: ':genre(items|products)',
            component: async () =>
              import(/* webpackChunkName: "v-item" */ './views/item/items'),
          },
          {
            path: ':genre(item|product)/:guid(\\d+)',
            name: 'item',
            component: async () =>
              import(/* webpackChunkName: "v-item" */ './views/item/item'),
          },

          // Construction
          {
            name: 'construction',
            path: 'construction',
            component: async () =>
              import(
                /* webpackChunkName: "v-construction" */ './views/construction/construction'
              ),
          },
          {
            name: 'building',
            path: 'building/:guid(\\d+)',
            component: async () =>
              import(
                /* webpackChunkName: "v-construction" */ './views/construction/building'
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

import Vue from 'vue';
import VueRouter from 'vue-router';
import { baseRouterPath } from '@src/utils';
import VLocalization from './views/localization';

Vue.use(VueRouter);

export function createRouter(): VueRouter {
  return new VueRouter({
    mode: 'history',
    base: baseRouterPath,
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
            path: 'test',
            name: 'test',
            component: async () =>
              import(/* webpackChunkName: "v-test" */ './views/test'),
          },
          {
            path: '',
            name: 'home',
            component: async () =>
              import(/* webpackChunkName: "v-home" */ './views/home'),
          },
          {
            path: 'products',
            name: 'products',
            component: async () =>
              import(/* webpackChunkName: "v-product" */ './views/product/products'),
          },
        ],
      },
    ],
  });
}

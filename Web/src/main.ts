import './main.scss';

import axios from 'axios';
import Vue from 'vue';
import VueRouter from 'vue-router';

import { localization, Language } from './utils/localization';
import { database } from './utils/database';

import * as allComponents from './components/all';
import { createRouter } from './router';
import VApp from './views/app';

Vue.use(localization);
Vue.use(database);
Object.entries(allComponents).forEach(([name, comp]) => Vue.component(name, comp));

Vue.config.productionTip = false;

export function createApp(): { app: Vue; router: VueRouter } {
  const router = createRouter();
  const app = new Vue({
    router,
    render: h => h(VApp),
  });

  return { app, router };
}

async function setup(): Promise<void> {
  const { app, router } = createApp();

  return new Promise<void>((resolve, reject) => {
    router.onReady(
      async () => {
        await Promise.all([
          app.$l10nLoad(app.$route.params.language as Language),
          app.$dbLoad(),
        ]);
        app.$mount('#app');
        resolve();
      },
      err => reject(err),
    );
  });
}

setup();

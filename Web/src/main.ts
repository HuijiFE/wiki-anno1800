import './main.scss';

import axios from 'axios';
import Vue from 'vue';
import VueRouter from 'vue-router';

import * as utils from './utils';
import { createRouter } from './router';
import VApp from './views/app';

// Install Vue plugins in utils
Object.values(utils).forEach(u => {
  if (typeof u === 'object' && 'install' in u) {
    Vue.use(u);
  }
});

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
        await Promise.all([app.$l10nLoad(app.$route.params.language), app.$dbLoad()]);
        app.$mount('#app');
        resolve();
      },
      err => reject(err),
    );
  });
}

if (process.env.NODE_ENV === 'development') {
  utils.debug();
}

setup();

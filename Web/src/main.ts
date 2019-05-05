import './main.scss';

import axios from 'axios';
import Vue from 'vue';
import VueRouter from 'vue-router';

import * as allComponents from './components/all';
import { createRouter } from './router';
import VApp from './views/app';

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
  const { data } = await axios.get(`${process.env.BASE_URL}db.json`);
  const { data: localization } = await axios.get(
    `${process.env.BASE_URL}localization/chinese.json`,
  );
  console.log(data);
  console.log(localization);

  const { app, router } = createApp();

  app.$mount('#app');
}

setup();

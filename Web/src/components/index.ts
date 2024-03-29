import Vue, { PluginObject } from 'vue';
import * as allComponents from './all';

export * from './all';

let $$Vue: typeof Vue;

export const components: PluginObject<never> = {
  install($Vue) {
    if ($$Vue && $$Vue === $Vue) {
      return;
    }
    $$Vue = $Vue;

    Object.entries(allComponents).forEach(([name, comp]) => $Vue.component(name, comp));
  },
};

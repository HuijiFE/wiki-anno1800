import Vue, { PluginObject } from 'vue';
import VueRouter from 'vue-router';

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Get full router path for <a/> href
     */
    $routerPath: (...paths: (string | number)[]) => string;
  }
}

let $$Vue: typeof Vue;

export const BASE_ROUTER_PATH = '/wiki/Anno1800/';

function resolveRouterPath(this: Vue, ...paths: (string | number)[]): string {
  return `${BASE_ROUTER_PATH}${this.$route.params.language}/${paths.join('/')}`.replace(
    /\/+/,
    '/',
  );
}

export const routerPath: PluginObject<never> = {
  install($Vue) {
    if ($$Vue && $$Vue === $Vue) {
      return;
    }
    $$Vue = $Vue;

    Object.defineProperty(Vue.prototype, '$routerPath', {
      get() {
        return resolveRouterPath;
      },
    });
  },
};

import Vue, { PluginObject } from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $routerPath: (...paths: (string | number)[]) => string;
  }
}

let $$Vue: typeof Vue;

export const baseRouterPath = '/wiki/Anno1800/';

function resolveRouterPath(this: Vue, ...paths: (string | number)[]): string {
  return `${baseRouterPath}${this.$route.params.language}/${paths.join('/')}`.replace(
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

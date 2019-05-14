import Vue, { PluginObject } from 'vue';
import { getResource } from './resource';

export type Language = 'en' | 'zh-CN';

export interface LocalizationDict {
  readonly [guid: string]: string;
  readonly [guid: number]: string;
}

const languageMap: Record<Language, string> = {
  en: 'english',
  'zh-CN': 'chinese',
};

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue = Vue> {
    readonly $l10n: LocalizationDict;
    readonly $l10nLoad: (language: string) => Promise<void>;
  }
  interface Vue {
    readonly $l10n: LocalizationDict;
    readonly $l10nLoad: (language: string) => Promise<void>;
  }
}

let $$Vue: typeof Vue;

/* eslint-disable no-param-reassign,@typescript-eslint/no-explicit-any */
export const localization: PluginObject<never> = {
  install($Vue: typeof Vue) {
    if ($$Vue && $$Vue === $Vue) {
      return;
    }
    const l10nLoad = async (language: string): Promise<void> => {
      const dict = await getResource(
        `/localization/${languageMap[language as Language] || language}.json`,
      );
      $Vue.prototype.$l10n = dict;
      ($Vue.$l10n as any) = dict;
    };
    $Vue.prototype.$l10nLoad = l10nLoad;
    ($Vue.$l10nLoad as any) = l10nLoad;
  },
};

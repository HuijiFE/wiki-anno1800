import Vue, { PluginFunction } from 'vue';
import { getResource } from './resource';

export type Language = 'zh-CN';

export interface LocalizationDict {
  readonly [guid: string]: string;
  readonly [guid: number]: string;
}

const languageMap: Record<Language, string> = {
  'zh-CN': 'chinese',
};

declare module 'vue/types/vue' {
  interface Vue {
    $l10n: LocalizationDict;
    $l10nLoad: (language: Language) => Promise<void>;
  }
}

let $$Vue: typeof Vue;

/* eslint-disable no-param-reassign */
export const localization: PluginFunction<never> = ($Vue: typeof Vue) => {
  if ($$Vue && $$Vue === $Vue) {
    return;
  }
  $Vue.prototype.$l10nLoad = async (language: Language): Promise<void> => {
    const dict = await getResource(
      `/localization/${languageMap[language] || language}.json`,
    );
    $Vue.prototype.$l10n = dict;
  };
};

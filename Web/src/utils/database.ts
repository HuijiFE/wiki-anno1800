import Vue, { PluginObject } from 'vue';
import { allTemplates, AssetTemplateMap, Asset } from '@public/db/definition';
import { getResource } from './resource';

export interface AssetDict {
  readonly [guid: string]: Asset;
  readonly [guid: number]: Asset;
}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue = Vue> {
    readonly $db: AssetDict;
    readonly $dbLoad: () => Promise<void>;
  }
  interface Vue {
    $db: AssetDict;
    $dbLoad: () => Promise<void>;
  }
}

let $$Vue: typeof Vue;

/* eslint-disable no-param-reassign,@typescript-eslint/no-explicit-any */
export const database: PluginObject<never> = {
  install($Vue: typeof Vue) {
    if ($$Vue && $$Vue === $Vue) {
      return;
    }
    const dbLoad = async (): Promise<void> => {
      const dict: Record<string, Asset> = {};
      const dataDicts = await Promise.all(
        allTemplates.map(t => getResource<Asset[]>(`/db/${t}.json`)),
      );
      dataDicts.forEach(subDict => {
        subDict.forEach(asset => {
          dict[asset.guid] = asset;
        });
      });
      $Vue.prototype.$db = dict;
      ($Vue.$db as any) = dict;
    };
    $Vue.prototype.$dbLoad = dbLoad;
    ($Vue.$dbLoad as any) = dbLoad;
  },
};

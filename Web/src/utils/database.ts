import Vue, { PluginFunction } from 'vue';
import { allTemplates, AssetTemplateMap, Asset } from '@public/db/definition';
import { getResource } from './resource';

export interface AssetDict {
  readonly [guid: string]: Asset;
  readonly [guid: number]: Asset;
}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue = Vue> {
    $db: AssetDict;
    $dbLoad: () => Promise<void>;
  }
  interface Vue {
    $db: AssetDict;
    $dbLoad: () => Promise<void>;
  }
}

let $$Vue: typeof Vue;

/* eslint-disable no-param-reassign */
export const database: PluginFunction<never> = ($Vue: typeof Vue) => {
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
    $Vue.$db = dict;
  };
  $Vue.prototype.$dbLoad = dbLoad;
  $Vue.$dbLoad = dbLoad;
};

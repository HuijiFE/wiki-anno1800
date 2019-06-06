import Vue, { PluginObject } from 'vue';
import {
  allTemplates,
  AssetTemplateMap,
  Asset,
  TemplateAssetMap,
} from '@public/db/definition';
import { getResource } from './resource';

export interface AssetDict {
  readonly [guid: string]: Asset;
  readonly [guid: number]: Asset;
}

export function resolveDatabase(dataset: Asset[][]): [AssetDict, ReadonlyArray<Asset>] {
  const dict: Record<number, Asset> = {};
  const list: Asset[] = dataset.reduce(
    (agg, cur) => {
      cur.forEach(a => {
        dict[a.guid] = a;
        agg.push(a);
      });
      return agg;
    },
    [] as Asset[],
  );
  list.sort((a, b) => a.guid - b.guid);

  return [dict, list];
}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue = Vue> {
    readonly $db: AssetDict;
    readonly $dbLoad: () => Promise<void>;
  }
  interface Vue {
    readonly $db: AssetDict;
    readonly $dbList: ReadonlyArray<Asset>;
    readonly $dbTemplateAssetMap: TemplateAssetMap;
    readonly $dbLoad: () => Promise<void>;
  }
}

let $$Vue: typeof Vue;

/* eslint-disable no-param-reassign,@typescript-eslint/no-explicit-any */
export const database: PluginObject<never> = {
  install($Vue: typeof Vue) {
    if ($$Vue && $$Vue === $Vue) {
      return;
    }
    $$Vue = $Vue;

    const dbLoad = async (): Promise<void> => {
      const [dataset, templateAssetMap] = await Promise.all([
        Promise.all(allTemplates.map(t => getResource<Asset[]>(`/db/${t}.json`))),
        getResource<TemplateAssetMap>('/db/template-asset-map.json'),
      ]);
      const [dict, list] = resolveDatabase(dataset);
      $Vue.prototype.$db = dict;
      $Vue.prototype.$dbList = list;
      $Vue.prototype.$dbTemplateAssetMap = templateAssetMap;
      ($Vue.$db as any) = dict;
    };
    $Vue.prototype.$dbLoad = dbLoad;
    ($Vue.$dbLoad as any) = dbLoad;
  },
};

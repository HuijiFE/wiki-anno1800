/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { ComponentOptions } from 'vue';
import { gameNameLocalization, Language } from './localization';

export interface SyncDataView<T = any> {
  title(): string;
  state: T;
  syncData(): T;
}

export const SERIALIZE_ELEMENT_ID = 'vue-app-anno-1800-serialize';

function serialize(state: any): void {
  let elem = document.querySelector<HTMLScriptElement>(`#${SERIALIZE_ELEMENT_ID}`);
  if (!elem) {
    elem = document.createElement('script');
    elem.id = SERIALIZE_ELEMENT_ID;
    elem.type = 'text/json';
    document.body.appendChild(elem);
  }
  elem.innerText = JSON.stringify(state);
}

function deserialize(): any {
  const elem = document.querySelector<HTMLScriptElement>(`#${SERIALIZE_ELEMENT_ID}`);
  if (!elem) {
    throw new Error(`Missing serialize element #${SERIALIZE_ELEMENT_ID}`);
  }
  return JSON.parse(elem.innerText);
}

export const MIXIN_SYNC_DATA_VIEW: ComponentOptions<Vue> = {
  created(this: Vue & SyncDataView) {
    if (process.env.NODE_ENV === 'development') {
      const state = this.syncData();
      serialize(state);
      this.state = JSON.parse(JSON.stringify(state));
    } else {
      this.state = deserialize();
    }
  },
  beforeMount(this: Vue & SyncDataView) {
    const title = [] as string[];

    title.push(this.title());
    title.push(gameNameLocalization[this.$route.params.language as Language]);
    title.push(gameNameLocalization.en);

    document.title = [...new Set(title)].filter(t => !!t).join(' | ');
  },
  renderError(this: Vue & SyncDataView, h) {
    return h('pre', {
      attrs: {
        'data-route': this.$route.fullPath,
      },
      domProps: {
        innerHTML: JSON.stringify(this.state, undefined, '  '),
      },
    });
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { ComponentOptions } from 'vue';
import { ENV } from './env';
import { gameNameLocalization, Language } from './localization';

export interface SyncDataView<T = any> {
  title(): string | string[];
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
    if (!ENV.APP_PLATFORM || ENV.APP_PLATFORM === 'csr') {
      const state = this.syncData();
      serialize(state);
      this.state = JSON.parse(JSON.stringify(state));
    } else {
      this.state = deserialize();
    }
  },
  beforeMount(this: Vue & SyncDataView) {
    const viewTitle = this.title();
    const title = [] as string[];

    title.push(...((Array.isArray(viewTitle) && viewTitle) || [viewTitle]));
    title.push(gameNameLocalization[this.$route.params.language as Language]);
    title.push(gameNameLocalization.en);

    document.title = [...new Set(title)].filter(t => !!t).join(' | ');
  },
  renderError(this: Vue & SyncDataView, h) {
    return h('div', [
      h('h1', {
        style: { color: 'red' },
        domProps: {
          innerHTML: 'ERROR',
        },
      }),
      h('pre', {
        attrs: {
          'data-route': this.$route.fullPath,
        },
        domProps: {
          innerHTML: JSON.stringify(this.state, undefined, '  '),
        },
      }),
    ]);
  },
};

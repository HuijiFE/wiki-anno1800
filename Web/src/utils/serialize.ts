/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { ComponentOptions } from 'vue';

export interface SyncDataView<T = any> {
  state: T;
  syncData(): T;
}

export const SERIALIZE_ELEMENT_ID = 'vue-app-anno-1800-serialize';

function serialize(state: any): void {
  let elem = document.querySelector<HTMLScriptElement>(`#${SERIALIZE_ELEMENT_ID}`);
  if (!elem) {
    elem = document.createElement('script');
    elem.id = SERIALIZE_ELEMENT_ID;
    elem.setAttribute('type', 'text/json');
    document.body.append(elem);
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
      this.state = state;
    } else {
      this.state = deserialize();
    }
  },
};

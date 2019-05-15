import Vue, { CreateElement, VNode } from 'vue';
import {
  Component,
  Emit,
  Inject,
  Model,
  Prop,
  Provide,
  Watch,
} from 'vue-property-decorator';
import {
  ProductFilter,
  ProductFilterData,
  Product,
  ItemFilter,
  ItemFilterData,
  ItemBuff,
  ItemData,
  ItemBalancing,
  ItemConfigData,
} from '@public/db/definition';
import {
  SyncDataView,
  MIXIN_SYNC_DATA_VIEW,
  GUID_PRODUCT_FILTER,
  GUID_ITEM_FILTER,
  GUID_ITEM_BALANCING,
  GUID_OIL,
} from '@src/utils';
import { Basic, Group } from '@src/components';

interface ItemState {
  guid: number;
}

/**
 * View: Item
 */
@Component({
  mixins: [MIXIN_SYNC_DATA_VIEW],
})
export default class VItem extends Vue implements SyncDataView<ItemState> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public state: ItemState = null as any;

  public syncData(): ItemState {
    return {
      guid: 0,
    };
  }

  private render(h: CreateElement): VNode {
    return <div staticClass="v-item">{this.$slots.default}</div>;
  }
}

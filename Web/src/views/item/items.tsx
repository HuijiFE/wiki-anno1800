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
  Product,
  ItemFilter,
  ItemBuff,
  ItemData,
} from '@public/db/definition';
import {
  SyncDataView,
  MIXIN_SYNC_DATA_VIEW,
  GUID_TEXT_ITEMS,
  GUID_TEXT_GOODS,
  GUID_ITEM_FILTER,
  GUID_PRODUCT_FILTER,
  GUID_PRODUCT_OIL,
} from '@src/utils';
import { Basic, Group } from '@src/components';

interface ItemsState {
  basics: Record<number, Basic<string>>;
  groups: Group<number>[];
}

/**
 * View: Items
 */
@Component({
  mixins: [MIXIN_SYNC_DATA_VIEW],
})
export default class VItems extends Vue implements SyncDataView<ItemsState> {
  public title(): string {
    return this.$route.params.genre === 'items'
      ? this.$l10n[GUID_TEXT_ITEMS]
      : this.$l10n[GUID_TEXT_GOODS];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public state: ItemsState = null as any;

  /* eslint-disable no-param-reassign */
  public syncData(): ItemsState {
    const basics: Record<number, Basic<string>> = {};
    const groups: Group<number>[] = [];

    if (this.genre === 'products') {
      const allProds = this.$dbList.filter((a): a is Product => !!(a as Product).product);
      allProds.forEach(prod => {
        basics[prod.guid] = {
          label: this.$l10n[prod.guid],
          icon: prod.icon,
          link: this.$routerPath('item', prod.guid),
        };
      });

      (this.$db[GUID_PRODUCT_FILTER] as ProductFilter).productFilter.categories.forEach(
        c => {
          groups.push({
            key: c.category,
            label: this.$l10n[c.category],
            icon: this.$db[c.category].icon,
            items: [...c.products],
          });
        },
      );
      groups[0].items.push(GUID_PRODUCT_OIL);

      groups.forEach(g => {
        g.label += ` ${g.items.length}`;
        g.items.forEach(prod => {
          if (!basics[prod]) {
            basics[prod] = {
              key: prod,
              label: this.$l10n[prod],
              icon: this.$db[prod].icon,
              link: this.$routerPath('product', prod),
            };
          }
        });
      });
    } else {
      const allItems = this.$dbList.filter((a: ItemBuff): a is ItemBuff => !!a.item);
      allItems.forEach(item => {
        basics[item.guid] = {
          key: item.guid,
          label: this.$l10n[item.guid],
          icon: item.icon,
          link: this.$routerPath('item', item.guid),
          data: (item.item as ItemData).rarity,
        };
      });

      (this.$db[GUID_ITEM_FILTER] as ItemFilter).itemFilter.categories.forEach(c => {
        groups.push({
          key: c.category,
          label: this.$l10n[c.category],
          icon: this.$db[c.category].icon,
          items: allItems
            .filter(item => c.types.includes((item.item as ItemData).allocation))
            .sort((a, b) => {
              return (
                c.types.indexOf((a.item as ItemData).allocation) -
                  c.types.indexOf((b.item as ItemData).allocation) || a.guid - b.guid
              );
            })
            .map(item => item.guid),
        });
      });
      groups.forEach(g => (g.label += ` ${g.items.length}`));
    }

    return { basics, groups };
  }

  private selectedIndex: number = 0;

  private get genre(): string {
    return this.$route.params.genre;
  }

  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-items" class={[`vp-genre_${this.genre}`]}>
        <c-toggle vModel={this.selectedIndex} items-source={this.state.groups} />
        <ul
          key={this.state.groups[this.selectedIndex].key}
          staticClass="v-items_grid"
          id={`tabpanel-${this.state.groups[this.selectedIndex].key}`}
          role="tabpanel"
          aria-labelledby={`tab-${this.state.groups[this.selectedIndex].key}`}
        >
          {this.state.groups[this.selectedIndex].items.map(guid => (
            <li key={guid} staticClass="v-items_cell">
              <a
                staticClass="v-items_item"
                class={{
                  [`is-${this.state.basics[guid].data}`]: !!this.state.basics[guid].data,
                }}
                href={this.state.basics[guid].link}
              >
                <span staticClass="v-items_socket">
                  <c-icon
                    staticClass="v-items_icon"
                    icon={this.state.basics[guid].icon}
                  />
                </span>
                <span staticClass="v-items_label">{this.state.basics[guid].label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

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
  GUID_PRODUCT_FILTER,
  GUID_ITEM_FILTER,
  GUID_ITEM_BALANCING,
  GUID_OIL,
} from '@src/utils';
import { Basic, Group } from '@src/components';

/**
 * Component: Items
 */
@Component
export default class VItems extends Vue {
  private selectedIndex: number = 0;

  private categories: Group<Basic<string>>[] = [];

  private get genre(): string {
    return this.$route.params.genre;
  }

  private created(): void {
    if (this.genre === 'products') {
      const inter = ((this.$db[GUID_PRODUCT_FILTER] as ProductFilter)
        .productFilter as ProductFilterData).categories.map<Group<Product>>(c => ({
        key: c.category,
        label: this.$l10n[c.category],
        icon: this.$db[c.category].icon,
        items: c.products.map(p => this.$db[p]),
      }));
      inter[0].items.push(this.$db[GUID_OIL]);

      this.categories = inter.map(g => ({
        key: g.key,
        label: `${g.label} (${g.items.length})`,
        icon: g.icon,
        items: g.items.map(prod => ({
          key: prod.guid,
          label: this.$l10n[prod.guid],
          icon: prod.icon,
          link: this.$routerPath('product', prod.guid),
        })),
      }));
    } else {
      const allItems = this.$dbList.filter((a: ItemBuff) => !!a.item);
      const inter = ((this.$db[GUID_ITEM_FILTER] as ItemFilter)
        .itemFilter as ItemFilterData).categories.map<Group<ItemBuff>>(c => ({
        key: c.category,
        label: this.$l10n[c.category],
        icon: this.$db[c.category].icon,
        items: allItems
          .filter((item: ItemBuff) =>
            c.types.includes((item.item as ItemData).allocation),
          )
          .sort((a: ItemBuff, b: ItemBuff) => {
            return (
              c.types.indexOf((a.item as ItemData).allocation) -
                c.types.indexOf((b.item as ItemData).allocation) || a.guid - b.guid
            );
          }),
      }));

      // const { allocationText, allocationIcons } = (this.$db[
      //   GUID_ITEM_BALANCING
      // ] as ItemBalancing).itemConfig as ItemConfigData;
      // Object.entries(allocationText).forEach(([name, guid]) => {
      //   inter.push({
      //     label: this.$l10n[guid],
      //     icon: allocationIcons[name],
      //     items: allItems.filter(
      //       (item: ItemBuff) => (item.item as ItemData).allocation === name,
      //     ),
      //   });
      // });

      this.categories = inter.map<Group<Basic<string>>>(g => ({
        key: g.key,
        label: `${g.label} (${g.items.length})`,
        icon: g.icon,
        items: g.items.map(item => ({
          key: item.guid,
          label: this.$l10n[item.guid],
          icon: item.icon,
          link: this.$routerPath('item', item.guid),
          data: (item.item as ItemData).rarity,
        })),
      }));
    }
  }

  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-items" class={[`vp-genre_${this.genre}`]}>
        {[this.categories.slice(0, 6), this.categories.slice(6)].map(
          (cs, ci) =>
            cs.length > 0 && (
              <ul
                staticClass="v-items_tabs"
                id={`tabs-${this.genre}-${ci}`}
                role="tablist"
              >
                {cs.map((group, index) => (
                  <li key={group.key} staticClass="v-items_tab-item">
                    <button
                      staticClass="v-items_tab-button"
                      class={{ 'is-selected': this.selectedIndex === index + ci * 6 }}
                      onClick={() => (this.selectedIndex = index + ci * 6)}
                      id={`tab-${group.key}`}
                      role="tab"
                      aria-controls={`tabpanel-${group.key}`}
                      aria-selected={this.selectedIndex === index + ci * 6}
                    >
                      <c-icon staticClass="v-items_tab-button-icon" icon={group.icon} />
                      <span staticClass="v-items_tab-button-label">{group.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ),
        )}
        <ul
          staticClass="v-items_grid"
          id={`tabpanel-${this.categories[this.selectedIndex].key}`}
          role="tabpanel"
          aria-labelledby={`tab-${this.categories[this.selectedIndex].key}`}
        >
          {this.categories[this.selectedIndex].items.map(item => (
            <li key={item.key} staticClass="v-items_cell">
              <a
                staticClass="v-items_item"
                class={{ [`is-${item.data}`]: !!item.data }}
                href={item.link}
              >
                <span staticClass="v-items_item-container">
                  <c-icon staticClass="v-items_item-icon" icon={item.icon} />
                </span>
                <span staticClass="v-items_item-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

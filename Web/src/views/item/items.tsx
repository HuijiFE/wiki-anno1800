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
  ItemFilter,
  ItemFilterData,
  ItemBuff,
  ItemData,
  ItemBalancing,
  ItemConfigData,
} from '@public/db/definition';
import { Item, Group } from '@src/components';

const guidProductFilter = 500514;
const guidItemFilter = 501516;

const guidOil = 1010566;
const guidItemBalancing = 6000017;

/**
 * Component: Items
 */
@Component
export default class VItems extends Vue {
  private selectedIndex: number = 0;

  private categories: Group<Item<string>>[] = [];

  private created(): void {
    let categories: Group<Item<string>>[];

    if (this.$route.params.genre === 'products') {
      categories = ((this.$db[guidProductFilter] as ProductFilter)
        .productFilter as ProductFilterData).categories.map<Group<Item<string>>>(c => ({
        label: `${this.$l10n[c.category]} (${c.products.length})`,
        icon: this.$db[c.category].icon,
        items: c.products.map(p => ({
          label: this.$l10n[p],
          icon: this.$db[p].icon,
          link: this.$routerPath('product', p),
        })),
      }));
      categories[0].items.push({
        label: this.$l10n[guidOil],
        icon: this.$db[guidOil].icon,
        link: this.$routerPath('product', guidOil),
      });
    } else {
      const allItems = this.$dbList.filter((a: ItemBuff) => !!a.item);
      const inter = ((this.$db[guidItemFilter] as ItemFilter)
        .itemFilter as ItemFilterData).categories.map<Group<ItemBuff>>(c => ({
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
      //   guidItemBalancing
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

      categories = inter.map<Group<Item<string>>>(g => ({
        label: `${g.label} (${g.items.length})`,
        icon: g.icon,
        items: g.items.map(item => ({
          label: this.$l10n[item.guid],
          icon: item.icon,
          link: this.$routerPath('item', item.guid),
          data: (item.item as ItemData).rarity,
        })),
      }));
    }

    this.categories = categories;
  }

  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-items" class={[`is-${this.$route.params.genre}`]}>
        {[this.categories.slice(0, 6), this.categories.slice(6)].map(
          (cs, ci) =>
            cs.length > 0 && (
              <ul staticClass="v-items_tabs" role="tablist">
                {cs.map((group, index) => (
                  <li staticClass="v-items_tab-item">
                    <button
                      staticClass="v-items_tab-button"
                      class={{ 'is-selected': this.selectedIndex === index + ci * 6 }}
                      role="tab"
                      onClick={() => (this.selectedIndex = index + ci * 6)}
                    >
                      <c-icon staticClass="v-items_tab-button-icon" icon={group.icon} />
                      <span staticClass="v-items_tab-button-label">{group.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ),
        )}
        {this.categories.map((group, index) => (
          <ul
            staticClass="v-items_grid"
            class={{ 'is-selected': this.selectedIndex === index }}
          >
            {group.items.map(item => (
              <li staticClass="v-items_cell">
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
        ))}
      </div>
    );
  }
}

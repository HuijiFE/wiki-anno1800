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
} from '@public/db/definition';
import { Item, Group } from '@src/components';

const guidOil = 1010566;

/**
 * Component: Items
 */
@Component
export default class VItems extends Vue {
  private selectedIndex: number = 0;

  private categories: Group[] = [];

  private created(): void {
    let categories: Group[];

    if (this.$route.params.type === 'products') {
      categories = ((this.$db[500514] as ProductFilter)
        .productFilter as ProductFilterData).categories.map<Group>(c => ({
        label: this.$l10n[c.category],
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
      categories = ((this.$db[501516] as ItemFilter)
        .itemFilter as ItemFilterData).categories.map<Group>(c => ({
        label: this.$l10n[c.category],
        icon: this.$db[c.category].icon,
        items: Object.values(this.$db)
          .filter((a: ItemBuff) => a.item && c.types.includes(a.item.allocation))
          .map(i => ({
            label: this.$l10n[i.guid],
            icon: i.icon,
            link: this.$routerPath('item', i.guid),
          })),
      }));
    }

    this.categories = categories;
  }

  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-items">
        <ul staticClass="v-items_tabs" role="tablist">
          {this.categories.map((group, index) => (
            <li staticClass="v-items_tab-item">
              <button
                staticClass="v-items_tab-button"
                class={{ 'is-selected': this.selectedIndex === index }}
                role="tab"
                onClick={() => (this.selectedIndex = index)}
              >
                <c-icon staticClass="v-items_tab-button-icon" icon={group.icon} />
                <span staticClass="v-items_tab-button-label">{group.label}</span>
              </button>
            </li>
          ))}
        </ul>
        {this.categories.map((group, index) => (
          <ul
            staticClass="v-items_grid"
            class={{ 'is-selected': this.selectedIndex === index }}
          >
            {group.items.map(item => (
              <li staticClass="v-items_cell">
                <a staticClass="v-items_item" href={item.link}>
                  <c-icon staticClass="v-items_item-icon" icon={item.icon} />
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

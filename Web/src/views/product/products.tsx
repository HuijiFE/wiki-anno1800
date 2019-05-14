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
import { ProductFilter, ProductFilterData, ProductCategory } from '@public/db/definition';
import { Item, Group } from '@src/components';

/**
 * Component: Products
 */
@Component
export default class VProducts extends Vue {
  private categories: Group[] = [];

  private created(): void {
    this.categories = ([this.$db[500514], this.$db[501593]] as ProductFilter[])
      .reduce(
        (agg, f) => {
          agg.push(...(f.productFilter as ProductFilterData).categories);
          return agg;
        },
        [] as ProductCategory[],
      )
      .map<ProductCategory>(c => ({ category: c.category, products: [...c.products] }))
      .reduce(
        (agg, cur) => {
          const reserve = agg.find(c => c.category === cur.category);
          if (reserve) {
            reserve.products.push(
              ...cur.products.filter(p => !reserve.products.includes(p)),
            );
          } else {
            agg.push(cur);
          }
          return agg;
        },
        [] as ProductCategory[],
      )
      .map<Group>(c => ({
        label: this.$l10n[c.category],
        items: c.products.map(p => ({
          label: this.$l10n[p],
          icon: this.$db[p].icon,
          link: this.$routerPath('product', p),
        })),
      }));
  }

  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-products">
        {this.categories.map(group => (
          <section>
            <h1>{group.label}</h1>
            <ul staticClass="v-products_list">
              {group.items.map(item => (
                <li staticClass="v-products_list-item">
                  <a staticClass="v-products_item" href={item.link}>
                    <c-icon size={56} icon={item.icon} />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }
}

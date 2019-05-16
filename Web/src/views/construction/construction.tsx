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
  Region,
  ConstructionMenu,
  ConstructionCategory,
  Building,
  ProductionChain,
  ProductionChainNode,
} from '@public/db/definition';
import {
  SyncDataView,
  MIXIN_SYNC_DATA_VIEW,
  GUID_REGION_MODERATE,
  GUID_REGION_COLONY01,
  GUID_TEXT_PRODUCTION_CHAIN,
  GUID_CONSTRUCTION_MENU,
  GUID_TEXT_SORTING_CATEGORY_TIER,
  ICON_SORTING_CATEGORY_TIER,
  GUID_TEXT_SORTING_CATEGORY_BUILDING,
  ICON_SORTING_CATEGORY_BUILDING,
} from '@src/utils';
import { Basic, Group } from '@src/components';

interface ConstructionState {
  buildings: Record<number, Basic<string[]>>;
  chains: Record<number, Basic<ProductionChainNode>>;
  subCategories: Record<number, Group<number>>;
  regions: Group<Group<Group<number>>>[];
}

/**
 * Component: Construction
 */
@Component({
  mixins: [MIXIN_SYNC_DATA_VIEW],
})
export default class VConstruction extends Vue
  implements SyncDataView<ConstructionState> {
  public title(): string {
    return this.$l10n[GUID_TEXT_PRODUCTION_CHAIN];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public state: ConstructionState = null as any;

  public syncData(): ConstructionState {
    const constructionMenu = this.$db[GUID_CONSTRUCTION_MENU] as ConstructionMenu;
    const regions = ([
      this.$db[GUID_REGION_MODERATE],
      this.$db[GUID_REGION_COLONY01],
    ] as Region[]).map<Group<Group<Group<number>>>>(rg => ({
      key: rg.region.id,
      label: this.$l10n[rg.guid],
      icon: rg.icon,
      items: [
        constructionMenu.constructionMenu.regionMenu[rg.region.id].tierCategories,
        constructionMenu.constructionMenu.regionMenu[rg.region.id].buildingCategories,
      ].map<Group<Group<number>>>((cs, csi) => ({
        key:
          csi === 0
            ? GUID_TEXT_SORTING_CATEGORY_TIER
            : GUID_TEXT_SORTING_CATEGORY_BUILDING,
        label: this.$l10n[
          csi === 0
            ? GUID_TEXT_SORTING_CATEGORY_TIER
            : GUID_TEXT_SORTING_CATEGORY_BUILDING
        ],
        icon: csi === 0 ? ICON_SORTING_CATEGORY_TIER : ICON_SORTING_CATEGORY_BUILDING,
        items: cs
          .map(c => this.$db[c] as ConstructionCategory)
          .map<Group<number>>(c => ({
            key: c.guid,
            label: this.$l10n[c.guid],
            icon: c.icon,
            items: [...c.constructionCategory.buildingList],
          })),
      })),
    }));

    const buildings: number[] = [];
    const subCategories: ConstructionCategory[] = [];
    const chains: Record<number, Basic<ProductionChainNode>> = {};
    const resolveNode = (node: ProductionChainNode): ProductionChainNode => {
      buildings.push(node.building);
      if (node.nodes) {
        node.nodes.forEach(n => resolveNode(n));
      }
      return node;
    };
    regions.forEach(rg =>
      rg.items.forEach(mn =>
        mn.items.forEach(c =>
          c.items.forEach(guid => {
            const asset = this.$db[guid] as (
              | Building
              | ProductionChain
              | ConstructionCategory);
            if ('building' in asset) {
              buildings.push(guid);
            }
            if ('chain' in asset) {
              chains[guid] = {
                key: guid,
                label: this.$l10n[guid],
                icon: asset.icon,
                link: '',
                data: resolveNode(asset.chain),
              };
            }
            if ('constructionCategory' in asset) {
              subCategories.push(asset);
              asset.constructionCategory.buildingList.forEach(b => buildings.push(b));
            }
          }),
        ),
      ),
    );

    return {
      buildings: buildings.reduce<Record<number, Basic>>((record, guid) => {
        if (!(this.$db[guid] as Building).building) {
          throw new Error(`GUID ${guid} is not a building`);
        }
        // eslint-disable-next-line no-param-reassign
        record[guid] = {
          label: this.$l10n[guid],
          icon: this.$db[guid].icon,
          link: this.$routerPath('building', guid),
          data: [...(this.$db[guid] as Building).building.regions],
        };
        return record;
      }, {}),
      chains,
      subCategories: subCategories.reduce<Record<number, Group<number>>>(
        (record, asset) => {
          // eslint-disable-next-line no-param-reassign
          record[asset.guid] = {
            label: this.$l10n[asset.guid],
            icon: asset.icon,
            items: [...asset.constructionCategory.buildingList],
          };
          return record;
        },
        {},
      ),
      regions,
    };
  }

  private selectedRegion: number = 0;

  private selectedSortingCategory: number = 0;

  private selectedCategory: number = 0;

  private renderBuilding(building: Basic<string[]>): VNode {
    return (
      <a staticClass="v-construction_building" href={building.link}>
        <c-icon staticClass="v-construction_building-icon" icon={building.icon} />
        <span staticClass="v-construction_building-label">{building.label}</span>
      </a>
    );
  }

  private renderChainNode(node: ProductionChainNode): VNode {
    return (
      <li staticClass="v-construction_chain">
        {this.renderBuilding(this.state.buildings[node.building])}
        {node.nodes && node.nodes.length > 0 && (
          <ul staticClass="v-construction_chain-nodes">
            {node.nodes.map(n => this.renderChainNode(n))}
          </ul>
        )}
      </li>
    );
  }

  private renderChain(chain: Basic<ProductionChainNode>): VNode {
    return (
      <div staticClass="v-construction_set">
        <header staticClass="v-construction_set-header">
          <c-icon staticClass="v-construction_set-icon" icon={chain.icon} />
          <span staticClass="v-construction_set-label">{chain.label}</span>
        </header>
        <ul staticClass="v-construction_set-body is-chain">
          {this.renderChainNode(chain.data as ProductionChainNode)}
        </ul>
      </div>
    );
  }

  private renderSubCategory(cat: Group<number>): VNode {
    return (
      <div staticClass="v-construction_set">
        <header staticClass="v-construction_set-header">
          <c-icon staticClass="v-construction_set-icon" icon={cat.icon} />
          <span staticClass="v-construction_set-label">{cat.label}</span>
        </header>
        <ul staticClass="v-construction_set-body">
          {cat.items.map(b => (
            <li staticClass="v-construction_set-item">
              {this.renderBuilding(this.state.buildings[b])}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  private render(h: CreateElement): VNode {
    const { regions } = this.state;
    const { items: sortingCategories } = regions[this.selectedRegion];
    const { items: categories } = sortingCategories[this.selectedSortingCategory];
    const { items } = categories[this.selectedCategory];

    return (
      <div staticClass="v-construction">
        <div staticClass="v-construction_menu">
          <c-toggle
            staticClass="v-construction_sub-menu"
            original-color
            hide-icon
            index={this.selectedRegion}
            onToggle={(index: number) => {
              this.selectedRegion = index;
              this.selectedCategory = 0;
            }}
            items-source={regions}
          />
          <c-toggle
            staticClass="v-construction_sub-menu"
            index={this.selectedSortingCategory}
            onToggle={(index: number) => {
              this.selectedSortingCategory = index;
              this.selectedCategory = 0;
            }}
            items-source={sortingCategories}
          />
          <c-toggle
            staticClass="v-construction_sub-menu"
            original-color
            hide-icon
            vModel={this.selectedCategory}
            items-source={categories}
          />
        </div>
        <ul
          key={categories[this.selectedCategory].key}
          staticClass="v-construction_wrapper"
        >
          {items.map(
            guid =>
              (this.state.buildings[guid] && (
                <li staticClass="v-construction_item is-building">
                  {this.renderBuilding(this.state.buildings[guid])}
                </li>
              )) ||
              (this.state.chains[guid] && (
                <li staticClass="v-construction_item is-set">
                  {this.renderChain(this.state.chains[guid])}
                </li>
              )) ||
              (this.state.subCategories[guid] && (
                <li staticClass="v-construction_item is-set">
                  {this.renderSubCategory(this.state.subCategories[guid])}
                </li>
              )),
          )}
        </ul>
      </div>
    );
  }
}

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
  Asset,
  ProductFilter,
  Product,
  Building,
  ResidenceBuilding7,
  PopulationLevel7,
  PopulationInput,
  InfluenceFeature,
  Region,
  ConstructionMenu,
  ConstructionCategory,
  ProductionChain,
  ProductionChainNode,
  FactoryBuilding7,
  ModuleOwnerBuilding,
  ModuleOwnerData,
  MaintenanceData,
  UpgradableData,
  PublicServiceData,
  Shipyard,
  Vehicle,
} from '@public/db/definition';
import {
  SyncDataView,
  MIXIN_SYNC_DATA_VIEW,
  GUID_PRODUCT_FILTER,
  GUID_PRODUCT_OIL,
  GUID_PRODUCT_MONEY,
  GUID_PRODUCT_INFLUENCE,
  GUID_LIST_WORKFORCE,
  GUID_INFLUENCE_FEATURE,
  GUID_REGION_MODERATE,
  GUID_REGION_COLONY01,
  GUID_CONSTRUCTION_MENU,
  GUID_FACTORY_CHARCOAL_BURNER,
  GUID_FACTORY_COAL_MINE,
  GUID_TEXT_GLOBAL_POPULATION,
  GUID_TEXT_CORPORATION_LEVEL,
  GUID_TEXT_RESIDENCE,
  GUID_TEXT_SHIP,
  GUID_TEXT_CONSTRUCTION,
  GUID_TEXT_GOODS,
} from '@src/utils';
import { BaseModel, Basic, Group } from '@src/components';
import { VCalcIo } from './calc-io';
import { VCalcProduct } from './calc-product';

export interface ModelAmount extends BaseModel {
  amount: number;
}

export interface ModelIO extends ModelAmount {
  inputs: [number, number][];
  outputs: [number, number][];
}

export interface ModelResidence extends ModelAmount {
  needs: PopulationInput[];
  workforce: number;
  workforceMax: number;
  influenceGenerator?: number;
}

interface CalculatorState {
  labels: {
    residence: string;
    construction: string;
    ship: string;
    goods: string;
  };

  supplyList: number[];
  workforceList: number[];
  goodsList: number[];
  productMap: Record<number, BaseModel>;

  residenceList: number[];
  residenceMap: Record<number, ModelResidence>;

  buildingList: number[];
  shipList: number[];
  ioMap: Record<number, ModelIO>;
}

/**
 * Component: Calculator
 */
@Component({
  mixins: [MIXIN_SYNC_DATA_VIEW],
  components: {
    VCalcIo,
    VCalcProduct,
  },
})
export default class VCalculator extends Vue implements SyncDataView<CalculatorState> {
  public title(): string {
    return 'Calculator';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public state: CalculatorState = null as any;

  public syncData(): CalculatorState {
    const supplyList = [
      GUID_PRODUCT_MONEY,
      GUID_PRODUCT_INFLUENCE,
      GUID_TEXT_GLOBAL_POPULATION,
      GUID_TEXT_CORPORATION_LEVEL,
    ];
    const workforceList = [...GUID_LIST_WORKFORCE];
    const goodsList = [
      ...(this.$db[GUID_PRODUCT_FILTER] as ProductFilter).productFilter.categories[0]
        .products,
      GUID_PRODUCT_OIL,
    ];

    const isProduct = (a: Asset): boolean =>
      supplyList.includes(a.guid) || 'product' in a;
    const productMap: Record<number, BaseModel> = this.$dbList
      .filter(isProduct)
      .reduce<Record<number, BaseModel>>((agg, prod) => {
        agg[prod.guid] = {
          label: this.$l10n[prod.guid],
          icon: prod.icon,
        };
        return agg;
      }, {});

    const residenceList: number[] = [...workforceList];
    const residenceMap: Record<number, ModelResidence> = {};

    const isResidence = (a: Asset): a is ResidenceBuilding7 => 'residnece7' in a;
    this.$dbList.filter(isResidence).forEach(residence => {
      const population = this.$db[residence.residnece7.population] as PopulationLevel7;

      const needs = population.population7.inputs.map<ModelResidence['needs'][0]>(ip => ({
        ...ip,
        amount: ip.amount * 60, // normalize to amount per minute
      }));
      const workforce = population.population7.outputs.filter(o => o.amount > 0)[0]
        .product;
      const workforceMax = residence.residnece7.max;
      const influenceGenerator =
        residence.residnece7.influenceGenerations.length > 0
          ? residence.residnece7.influenceGenerations[0].keep
          : 0;

      const index = residenceList.indexOf(workforce);
      residenceList[index] = residence.guid;
      const model: ModelResidence = {
        label: this.$l10n[residence.guid],
        icon: population.icon,
        needs,
        workforce,
        workforceMax,
        amount: 0,
      };
      if (influenceGenerator) {
        model.influenceGenerator = influenceGenerator;
      }
      residenceMap[residence.guid] = model;
    });

    const buildingList: number[] = [];
    const shipList: number[] = [];
    const ioMap: Record<number, ModelIO> = {};

    const influenceFeature = this.$db[GUID_INFLUENCE_FEATURE] as InfluenceFeature;

    const isConstructionCategory = (a: Asset): a is ConstructionCategory =>
      'constructionCategory' in a;
    const isProductionChain = (a: Asset): a is ProductionChain => 'chain' in a;
    const isBuilding = (a: Asset): a is Building => 'building' in a;
    const isNeedMaintenance = (
      a: Asset | { maintenance: MaintenanceData },
    ): a is Building & { maintenance: MaintenanceData } =>
      'maintenance' in a && !!a.maintenance;
    const isNeedInfluence = (a: Building | Vehicle): boolean =>
      !!(a.cost && influenceFeature.influenceFeature.configs[a.cost.influenceCostType]);
    const isUpgradable = (
      a: Asset | { upgradable: UpgradableData },
    ): a is Building & { upgradable: UpgradableData } =>
      'upgradable' in a && !!a.upgradable;
    const isFactory = (a: Asset): a is FactoryBuilding7 => 'factory' in a;
    const isModuleOwner = (
      a: Asset | { moduleOwner: ModuleOwnerData },
    ): a is ModuleOwnerBuilding & { moduleOwner: ModuleOwnerData } =>
      'moduleOwner' in a && !!a.moduleOwner;
    const isShipyard = (a: Asset): a is Shipyard => 'shipyard' in a;
    const isPublicServiceBuilding = (
      a: Building,
    ): a is Building & { publicService: PublicServiceData } => 'publicService' in a;
    const isShip = (a: Asset): a is Vehicle => 'shipMaintenance' in a;

    const resolveChainNode = (node: ProductionChainNode): void => {
      // eslint-disable-next-line
      resolveBuilding(node.building);
      if (node.nodes) {
        node.nodes.forEach(resolveChainNode);
      }
    };
    const resolveBuilding = (guid: number): void => {
      const asset = this.$db[guid];
      if (!asset) return;

      if (isConstructionCategory(asset)) {
        asset.constructionCategory.buildingList.forEach(resolveBuilding);
        return;
      }
      if (isProductionChain(asset)) {
        resolveChainNode(asset.chain);
        return;
      }

      if (!buildingList.includes(guid) && isBuilding(asset) && !isResidence(asset)) {
        if (
          isFactory(asset) ||
          isShipyard(asset) ||
          isNeedMaintenance(asset) ||
          isNeedInfluence(asset) ||
          isPublicServiceBuilding(asset)
        ) {
          buildingList.push(guid);
          if (guid === GUID_FACTORY_CHARCOAL_BURNER) {
            resolveBuilding(GUID_FACTORY_COAL_MINE);
          }
          if (isUpgradable(asset)) {
            resolveBuilding(asset.upgradable.next);
          }
          if (isModuleOwner(asset)) {
            asset.moduleOwner.options.forEach(resolveBuilding);
          }
          if (isShipyard(asset)) {
            asset.shipyard.assemblyOptions.forEach(ship => {
              if (!shipList.includes(ship)) {
                shipList.push(ship);
              }
            });
          }
        }
      }
    };

    // Construction Category Index
    [0, 1, 2, 3, 4].forEach(index => {
      ([
        this.$db[GUID_REGION_MODERATE],
        this.$db[GUID_REGION_COLONY01],
      ] as Region[]).forEach(({ region: { id: regionID } }) => {
        const category = this.$db[
          (this.$db[GUID_CONSTRUCTION_MENU] as ConstructionMenu).constructionMenu
            .regionMenu[regionID].buildingCategories[index]
        ] as ConstructionCategory;
        category.constructionCategory.buildingList.forEach(resolveBuilding);
      });
    });

    [...buildingList, ...shipList].forEach(guid => {
      const asset = this.$db[guid] as Building | Vehicle;
      const inputs: [number, number][] = [];
      const outputs: [number, number][] = [];

      if (isShip(asset)) {
        inputs.push([GUID_PRODUCT_MONEY, asset.shipMaintenance]);
      }
      if (isNeedMaintenance(asset)) {
        asset.maintenance.maintenances.forEach(mt =>
          inputs.push([mt.product, mt.amount]),
        );
      }
      if (asset.cost) {
        const influenceConfig =
          influenceFeature.influenceFeature.configs[asset.cost.influenceCostType];
        if (influenceConfig) {
          inputs.push([
            GUID_PRODUCT_INFLUENCE,
            asset.cost.influenceCostPoints * influenceConfig.costs,
          ]);
        }
      }
      if (isFactory(asset)) {
        const { factory } = asset;
        // normalize to amount per minute
        factory.inputs.forEach(ip =>
          inputs.push([ip.product, (ip.amount * 60) / factory.cycleTime]),
        );
        factory.outputs.forEach(op =>
          outputs.push([op.product, (op.amount * 60) / factory.cycleTime]),
        );
      }
      if (isBuilding(asset) && isPublicServiceBuilding(asset)) {
        asset.publicService.publicServiceOutputs.forEach(op => outputs.push([op, -1]));
      }

      ioMap[guid] = {
        label: this.$l10n[guid],
        icon: asset.icon,
        inputs,
        outputs,
        amount: 0,
      };
    });

    return {
      labels: {
        residence: this.$l10n[GUID_TEXT_RESIDENCE],
        construction: this.$l10n[GUID_TEXT_CONSTRUCTION],
        ship: this.$l10n[GUID_TEXT_SHIP],
        goods: this.$l10n[GUID_TEXT_GOODS],
      },

      supplyList,
      workforceList,
      goodsList,
      productMap,

      residenceList,
      residenceMap,

      buildingList,
      shipList,
      ioMap,
    };
  }

  private selected: number = 0;

  private get trendMaps(): {
    building: Record<number, number>;
    ship: Record<number, number>;
    residence: Record<number, number>;
    global: Record<number, number>;
  } {
    const {
      state: {
        supplyList,
        workforceList,
        goodsList,
        productMap,
        residenceList,
        residenceMap,
        buildingList,
        shipList,
        ioMap,
      },
    } = this;
    const trendEmpty = [...supplyList, ...workforceList, ...goodsList].reduce<
      Record<number, number>
    >((result, guid) => {
      result[guid] = 0;
      return result;
    }, {});

    const [trendBuilding, trendShip] = [buildingList, shipList].map(list => {
      const result: Record<number, number> = {};
      list.forEach(guid => {
        const { inputs, outputs, amount: ioAmount } = ioMap[guid];
        if (!ioAmount) return;

        inputs.forEach(([product, amount]) => {
          result[product] = (result[product] || 0) - amount * ioAmount;
        });
        outputs.forEach(([product, amount]) => {
          result[product] = (result[product] || 0) + amount * ioAmount;
        });
      });
      return result;
    });

    const trendResidence: Record<number, number> = {};
    residenceList.forEach(guid => {
      const { needs, amount: residenceAmount } = residenceMap[guid];
      if (!residenceAmount) return;

      needs.forEach(nd => {
        // if the amount of the need is 0, means the need is for abstract product, like market
        if (nd.amount > 0) {
          trendResidence[nd.product] =
            (trendResidence[nd.product] || 0) - nd.amount * residenceAmount;
        }
      });
    });
    residenceList.forEach(guid => {
      const {
        needs,
        workforce,
        workforceMax,
        influenceGenerator,
        amount: residenceAmount,
      } = residenceMap[guid];
      if (!residenceAmount) return;

      let supply = 0;
      let money = 0;
      needs.forEach(nd => {
        if (
          (nd.amount === 0 && trendBuilding[nd.product] < 0) ||
          (nd.amount > 0 && trendBuilding[nd.product] + trendResidence[nd.product] >= 0)
        ) {
          supply += nd.supply;
          money += nd.money;
        }
      });
      trendResidence[GUID_PRODUCT_MONEY] =
        (trendResidence[GUID_PRODUCT_MONEY] || 0) + money * residenceAmount;
      trendResidence[workforce] = Math.min(supply, workforceMax) * residenceAmount;
      if (influenceGenerator && supply > influenceGenerator) {
        trendResidence[GUID_PRODUCT_INFLUENCE] = residenceAmount;
      }
    });
    trendResidence[GUID_TEXT_GLOBAL_POPULATION] = 0;
    workforceList.forEach(
      guid => (trendResidence[GUID_TEXT_GLOBAL_POPULATION] += trendResidence[guid] || 0),
    );

    const trendGlobal = [trendEmpty, trendBuilding, trendShip, trendResidence].reduce<
      Record<string, number>
    >((result, cur) => {
      Object.entries(cur).forEach(([guid, amount]) => {
        result[guid] = (result[guid] || 0) + amount;
      });
      return result;
    }, {});

    return {
      building: trendBuilding,
      ship: trendShip,
      residence: trendResidence,
      global: trendGlobal,
    };
  }

  private render(h: CreateElement): VNode {
    const {
      trendMaps,
      state: {
        supplyList,
        workforceList,
        goodsList,
        productMap,
        residenceList,
        residenceMap,
        buildingList,
        shipList,
        ioMap,
      },
    } = this;

    return (
      <div staticClass="v-calculator" onClick={() => (this.selected = 0)}>
        <div key="io" staticClass="v-calculator_wrapper">
          {[...residenceList, ...buildingList, ...shipList].map(guid => (
            <v-calc-io
              key={guid}
              vModel={(ioMap[guid] || residenceMap[guid]).amount}
              model-source={ioMap[guid] || residenceMap[guid]}
              product-map={productMap}
              selected={this.selected === guid}
              onSelect={() => (this.selected = guid)}
              onUnselect={() => (this.selected = 0)}
            />
          ))}
        </div>

        <div staticClass="v-calculator_products">
          {[supplyList, workforceList, goodsList].map((products, i) => (
            <div key={i} staticClass="v-calculator_wrapper">
              {products.map(guid => (
                <v-calc-product
                  key={guid}
                  model-source={productMap[guid]}
                  value={trendMaps.global[guid]}
                />
              ))}
            </div>
          ))}
        </div>

        {/* <pre>
          {JSON.stringify(
            {
              ...this.state,
              trendMaps,
            },
            undefined,
            '  ',
          )}
        </pre> */}
      </div>
    );
  }
}

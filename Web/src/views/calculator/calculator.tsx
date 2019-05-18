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
  ParticipantRepresentationFeature,
  CompanyLevelData,
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
  formatNumber,
  getGlobalPopulationForCorporationLevel,
  getCorporationLevelForGlobalPopulation,
  getInfluenceForCorporationLevel,
  GUID_PARTICIPANT_REPRESENTATION_FEATURE,
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
  GUID_TEXT_COMPANY_LEVEL_NEXT,
  GUID_TEXT_RESIDENCE,
  GUID_TEXT_SHIP,
  GUID_TEXT_CONSTRUCTION,
  GUID_TEXT_GOODS,
  GUID_TEXT_INFLUENCE_FROM_POPULATION,
  GUID_TEXT_INFLUENCE_FROM_INVESTORS,
} from '@src/utils';
import { BaseModel, Basic, Group } from '@src/components';
import { VCalcIo } from './calc-io';
import { VCalcProduct } from './calc-product';

export interface ModelIO extends BaseModel {
  inputs: [number, number][];
  outputs: [number, number][];
}

export interface ModelResidence extends BaseModel {
  needs: PopulationInput[];
  workforce: number;
  workforceMax: number;
  influenceGenerator?: number;
}

interface CalculatorState {
  companyLevelData: CompanyLevelData;

  labels: {
    residence: string;
    construction: string;
    ship: string;
    goods: string;
    companyNextLevel: string;
    influenceFromPopulation: string;
    influenceFromInvestors: string;
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

  public state!: CalculatorState;

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
      };
    });

    return {
      companyLevelData: (this.$db[
        GUID_PARTICIPANT_REPRESENTATION_FEATURE
      ] as ParticipantRepresentationFeature).participant.companyLevel,

      labels: {
        residence: this.$l10n[GUID_TEXT_RESIDENCE],
        construction: this.$l10n[GUID_TEXT_CONSTRUCTION],
        ship: this.$l10n[GUID_TEXT_SHIP],
        goods: this.$l10n[GUID_TEXT_GOODS],
        companyNextLevel: this.$l10n[GUID_TEXT_COMPANY_LEVEL_NEXT],
        influenceFromPopulation: this.$l10n[GUID_TEXT_INFLUENCE_FROM_POPULATION],
        influenceFromInvestors: this.$l10n[GUID_TEXT_INFLUENCE_FROM_INVESTORS],
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private amountMap: Record<number, number> = null as any;

  private resetAmountMap(): void {
    this.amountMap = [
      this.state.supplyList,
      this.state.workforceList,
      this.state.goodsList,
      this.state.residenceList,
      this.state.buildingList,
      this.state.shipList,
    ].reduce<Record<number, number>>((result, list) => {
      list.forEach(guid => (result[guid] = 0));
      return result;
    }, {});
  }

  private beforeMount(): void {
    this.resetAmountMap();
  }

  private get trendMaps(): {
    trendBuilding: Record<number, number>;
    trendShip: Record<number, number>;
    trendResidence: Record<number, number>;
    moneyResidence: Record<number, number>;
    trendGlobal: Record<number, number>;
    corporation: {
      level: number;
      nextPopulation: number;
      influence: number;
    };
  } {
    const {
      state: {
        companyLevelData,
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
      amountMap,
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
        const { inputs, outputs } = ioMap[guid];
        const ioAmount = amountMap[guid];
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
    const moneyResidence: Record<number, number> = {};
    trendResidence[GUID_TEXT_GLOBAL_POPULATION] = 0;
    trendResidence[GUID_PRODUCT_MONEY] = 0;
    residenceList.forEach(guid => {
      const { needs } = residenceMap[guid];
      const residenceAmount = amountMap[guid];
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
      const { needs, workforce, workforceMax, influenceGenerator } = residenceMap[guid];
      const residenceAmount = amountMap[guid];
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
      moneyResidence[guid] = money * residenceAmount;
      trendResidence[GUID_PRODUCT_MONEY] += moneyResidence[guid];
      trendResidence[workforce] = Math.min(supply, workforceMax) * residenceAmount;
      trendResidence[GUID_TEXT_GLOBAL_POPULATION] += trendResidence[workforce];
      if (influenceGenerator && supply > influenceGenerator) {
        trendResidence[GUID_PRODUCT_INFLUENCE] = residenceAmount;
      }
    });

    const trendGlobal = [trendEmpty, trendBuilding, trendShip, trendResidence].reduce<
      Record<string, number>
    >((result, cur) => {
      Object.entries(cur).forEach(([guid, amount]) => {
        result[guid] = (result[guid] || 0) + amount;
      });
      return result;
    }, {});

    const globalPopulation = trendResidence[GUID_TEXT_GLOBAL_POPULATION];
    const level = getCorporationLevelForGlobalPopulation(
      companyLevelData,
      globalPopulation,
    );
    const nextPopulation = getGlobalPopulationForCorporationLevel(
      companyLevelData,
      level + 1,
    );
    const influence = getInfluenceForCorporationLevel(level);

    trendGlobal[GUID_PRODUCT_INFLUENCE] += influence;

    return {
      trendBuilding,
      trendShip,
      trendResidence,
      moneyResidence,
      trendGlobal,
      corporation: {
        level,
        nextPopulation,
        influence,
      },
    };
  }

  private render(h: CreateElement): VNode {
    const {
      state: {
        labels,
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
      trendMaps,
      amountMap,
    } = this;
    const {
      trendBuilding,
      trendShip,
      trendResidence,
      moneyResidence,
      trendGlobal,
      corporation,
    } = trendMaps;

    const stats: Group<BaseModel<number>, number>[] = [
      {
        key: GUID_PRODUCT_MONEY,
        label: productMap[GUID_PRODUCT_MONEY].label,
        icon: productMap[GUID_PRODUCT_MONEY].icon,
        data: trendGlobal[GUID_PRODUCT_MONEY],
        items: [
          ...residenceList.map(guid => ({
            label: residenceMap[guid].label,
            icon: residenceMap[guid].icon,
            data: moneyResidence[guid],
          })),
          {
            label: labels.construction,
            data: trendBuilding[GUID_PRODUCT_MONEY],
          },
          {
            label: labels.ship,
            data: trendShip[GUID_PRODUCT_MONEY],
          },
        ],
      },
      {
        key: GUID_PRODUCT_INFLUENCE,
        label: productMap[GUID_PRODUCT_INFLUENCE].label,
        icon: productMap[GUID_PRODUCT_INFLUENCE].icon,
        data: trendGlobal[GUID_PRODUCT_INFLUENCE],
        items: [
          {
            label: labels.influenceFromPopulation,
            data: corporation.influence,
          },
          {
            label: labels.influenceFromInvestors,
            data: trendResidence[GUID_PRODUCT_INFLUENCE],
          },
          {
            label: labels.construction,
            data: trendBuilding[GUID_PRODUCT_INFLUENCE],
          },
          {
            label: labels.ship,
            data: trendShip[GUID_PRODUCT_INFLUENCE],
          },
        ],
      },
      {
        key: GUID_TEXT_GLOBAL_POPULATION,
        label: productMap[GUID_TEXT_GLOBAL_POPULATION].label,
        icon: productMap[GUID_TEXT_GLOBAL_POPULATION].icon,
        data: trendGlobal[GUID_TEXT_GLOBAL_POPULATION],
        items: workforceList.map(guid => ({
          label: productMap[guid].label,
          icon: productMap[guid].icon,
          data: trendResidence[guid],
        })),
      },
      {
        key: GUID_TEXT_CORPORATION_LEVEL,
        label: productMap[GUID_TEXT_CORPORATION_LEVEL].label,
        icon: productMap[GUID_TEXT_CORPORATION_LEVEL].icon,
        data: corporation.level,
        items: [
          {
            label: labels.companyNextLevel,
            data: corporation.nextPopulation,
          },
        ],
      },
    ];

    return (
      <div staticClass="v-calculator" onClick={() => (this.selected = 0)}>
        <div key="stat" staticClass="v-calculator_stat">
          {stats.map(stat => (
            <div key={stat.key} staticClass="v-calculator_stat-item">
              <c-icon staticClass="v-calculator_stat-icon" size={16} icon={stat.icon} />
              {formatNumber(stat.data as number)}
              <div key="panel" staticClass="v-calculator_stat-panel">
                <div key="global" staticClass="v-calculator_stat-row">
                  <c-icon
                    staticClass="v-calculator_stat-icon"
                    size={24}
                    icon={stat.icon}
                  />
                  <span staticClass="v-calculator_stat-label">{stat.label}</span>
                  <span staticClass="v-calculator_stat-value">
                    {(stat.data || 0).toLocaleString()}
                  </span>
                </div>
                {stat.items.map((item, index) => (
                  <div key={index} staticClass="v-calculator_stat-row">
                    {item.icon && (
                      <c-icon staticClass="v-calculator_stat-icon" icon={item.icon} />
                    )}
                    <span staticClass="v-calculator_stat-label">{item.label}</span>
                    <span staticClass="v-calculator_stat-value">
                      {(item.data || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div key="workforce" staticClass="v-calculator_stat">
          {workforceList.map(guid => (
            <div key={guid} staticClass="v-calculator_stat-item">
              <c-icon
                staticClass="v-calculator_stat-icon"
                size={16}
                icon={productMap[guid].icon}
              />
              {trendGlobal[guid].toLocaleString()}
            </div>
          ))}
        </div>

        <div key="io" staticClass="v-calculator_wrapper">
          {[
            labels.residence,
            ...residenceList,
            labels.construction,
            ...buildingList,
            labels.ship,
            ...shipList,
          ].map(guid =>
            typeof guid === 'string' ? (
              <div key={guid} staticClass="v-calculator_label">
                <span staticClass="v-calculator_label-content">{guid}</span>
              </div>
            ) : (
              <v-calc-io
                key={guid}
                vModel={amountMap[guid]}
                model-source={ioMap[guid] || residenceMap[guid]}
                product-map={productMap}
                selected={this.selected === guid}
                onSelect={() => (this.selected = guid)}
                onUnselect={() => (this.selected = 0)}
              />
            ),
          )}
          <div key={labels.goods} staticClass="v-calculator_label">
            <span staticClass="v-calculator_label-content">{labels.goods}</span>
          </div>
          {goodsList.map(guid => (
            <v-calc-product
              key={guid}
              model-source={productMap[guid]}
              value={trendGlobal[guid]}
            />
          ))}
        </div>

        <pre>
          {JSON.stringify(
            {
              ...this.state,
              ...trendMaps,
            },
            undefined,
            '  ',
          )}
        </pre>
      </div>
    );
  }
}

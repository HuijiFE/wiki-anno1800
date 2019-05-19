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
  InfluenceConfig,
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
  GUID_TEXT_RESIDENCE,
  GUID_TEXT_CONSTRUCTION,
  GUID_TEXT_SHIP,
  GUID_TEXT_GLOBAL_POPULATION,
  GUID_TEXT_CORPORATION_LEVEL,
  GUID_TEXT_COMPANY_LEVEL_NEXT,
  GUID_TEXT_GOODS,
  GUID_TEXT_INFLUENCE_FROM_POPULATION,
  GUID_TEXT_INFLUENCE_FROM_INVESTORS,
  GUID_TEXT_MAINTENANCE,
  GUID_TEXT_MAINTENANCE_SHIP,
  GUID_TEXT_WORKFORCE_GENERATION,
  GUID_TEXT_WORKFORCE_CONSUMPTION,
} from '@src/utils';
import { BaseModel, Basic, Group } from '@src/components';
import { VCalcIo } from './calc-io';
import { VCalcProduct } from './calc-product';

export interface ModelResidence extends BaseModel {
  needs: PopulationInput[];
  workforce: number;
  workforceMax: number;
  influenceGenerator?: number;
}

export interface ModelIO extends BaseModel {
  inputs: [number, number][];
  outputs: [number, number][];
  influenceType: string;
}

interface CalculatorState {
  companyLevelData: CompanyLevelData;
  influenceConfigs: Record<string, BaseModel<number>>;

  labels: Record<number, BaseModel>;

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

type TrendMap = Record<number | string, Record<number, number>>;

interface TrendMaps {
  // { [product: number]: { [io: number]: number } }
  trendInputs: TrendMap;
  trendOutputs: TrendMap;
  trendShip: TrendMap;
  trendResidence: TrendMap;
  trendGlobal: Record<number, number>;
  trendMoney: {
    building: number;
    ship: number;
  };
  trendPopulation: Record<string, number>;
  trendInfluence: Record<string, number>;
  corporation: {
    globalPopulation: number;
    level: number;
    nextPopulation: number;
    globalInfluence: number;
    influenceFromPopulation: number;
    influenceFromInvestors: number;
  };
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
    const labels = [
      GUID_TEXT_RESIDENCE,
      GUID_TEXT_CONSTRUCTION,
      GUID_TEXT_SHIP,
      GUID_TEXT_GOODS,
      GUID_TEXT_CORPORATION_LEVEL,
      GUID_TEXT_COMPANY_LEVEL_NEXT,
      GUID_TEXT_INFLUENCE_FROM_POPULATION,
      GUID_TEXT_INFLUENCE_FROM_INVESTORS,
      GUID_TEXT_MAINTENANCE,
      GUID_TEXT_MAINTENANCE_SHIP,

      GUID_TEXT_WORKFORCE_GENERATION,
      GUID_TEXT_WORKFORCE_CONSUMPTION,
    ].reduce<Record<number, BaseModel>>((result, guid) => {
      result[guid] = {
        key: guid,
        label: this.$l10n[guid],
      };
      if (this.$db[guid]) {
        result[guid].icon = this.$db[guid].icon;
      }
      return result;
    }, {});

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
    const ioMap: Record<number, ModelIO> = {};
    const shipList: number[] = [];

    const influenceFeature = this.$db[GUID_INFLUENCE_FEATURE] as InfluenceFeature;
    const influenceConfigs = Object.entries(
      influenceFeature.influenceFeature.configs,
    ).reduce<Record<string, BaseModel<number>>>((result, [key, conf]) => {
      result[key] = {
        label: this.$l10n[conf.subCategoryName],
        icon: this.$db[conf.subCategoryName].icon,
        data: conf.freeAmount,
      };
      return result;
    }, {});

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
      let influenceType = '';

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
          influenceType = asset.cost.influenceCostType;
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
        asset.publicService.publicServiceOutputs.forEach(op => outputs.push([op, 1]));
      }

      ioMap[guid] = {
        label: this.$l10n[guid],
        icon: asset.icon,
        inputs,
        outputs,
        influenceType,
      };
    });

    return {
      companyLevelData: (this.$db[
        GUID_PARTICIPANT_REPRESENTATION_FEATURE
      ] as ParticipantRepresentationFeature).participant.companyLevel,
      influenceConfigs,

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
    };
  }

  private selected: number = 0;

  private productList!: number[];

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
    this.productList = Object.keys(this.state.productMap).map(p => Number(p));
    this.resetAmountMap();
  }

  private get trendMaps(): TrendMaps {
    const {
      state: {
        companyLevelData,
        influenceConfigs,

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
      productList,
      amountMap,
    } = this;
    const [trendInputs, trendOutputs, trendShip, trendResidence] = Array(4)
      .fill(0)
      .map(() =>
        productList.reduce<TrendMap>((map, prod) => {
          map[prod] = {};
          return map;
        }, {}),
      );
    const trendGlobal = productList.reduce<Record<number, number>>((result, prod) => {
      result[prod] = 0;
      return result;
    }, {});
    const trendInfluence: Record<string, number> = Object.keys(influenceConfigs).reduce<
      Record<string, number>
    >((result, key) => {
      result[key] = 0;
      return result;
    }, {});

    buildingList.forEach(building => {
      const amount = amountMap[building];
      if (!amount) return;
      const { inputs, outputs, influenceType } = ioMap[building];
      inputs.forEach(([product, amountProduct]) => {
        const value = -amountProduct * amount;
        if (product === GUID_PRODUCT_INFLUENCE) {
          trendInfluence[influenceType] += value;
          return;
        }
        trendInputs[product][building] = value;
        trendGlobal[product] += value;
      });
      outputs.forEach(([product, amountProduct]) => {
        const value = amountProduct * amount;
        trendInputs[product][building] = value;
        trendGlobal[product] += value;
      });
    });
    shipList.forEach(ship => {
      const amount = amountMap[ship];
      if (!amount) return;
      const { inputs, influenceType } = ioMap[ship];
      inputs.forEach(([product, amountProduct]) => {
        const value = -amountProduct * amount;
        if (product === GUID_PRODUCT_INFLUENCE) {
          trendInfluence[influenceType] += value;
          return;
        }
        trendShip[product][ship] = value;
        trendGlobal[product] += value;
      });
    });
    residenceList.forEach(residence => {
      const amount = amountMap[residence];
      if (!amount) return;
      const { needs } = residenceMap[residence];
      needs.forEach(({ product, amount: amountProduct }) => {
        const value = -amountProduct * amount;
        trendResidence[product][residence] = value;
        trendGlobal[product] += value;
      });
    });

    const trendPopulation: Record<number, number> = workforceList.reduce<
      Record<number, number>
    >((result, guid) => {
      result[guid] = 0;
      return result;
    }, {});
    let globalPopulation = 0;
    let influenceFromInvestors = 0;
    residenceList.forEach(residence => {
      const amount = amountMap[residence];
      if (!amount) return;
      const { needs, workforce, workforceMax, influenceGenerator } = residenceMap[
        residence
      ];
      let totalSupply = 0;
      let totalMoney = 0;
      let totalHappiness = 0;
      needs.forEach(({ product, amount: productAmount, supply, money, happiness }) => {
        if (
          (productAmount === 0 && trendGlobal[product] > 0) ||
          (productAmount > 0 && trendGlobal[product] >= 0)
        ) {
          totalSupply += supply;
          totalMoney += money;
          totalHappiness += happiness;
        }
      });

      totalSupply = Math.min(totalSupply, workforceMax);
      totalSupply *= amount;
      totalMoney *= amount;

      trendPopulation[workforce] = totalSupply;
      trendGlobal[workforce] += totalSupply;
      globalPopulation += totalSupply;

      trendResidence[GUID_PRODUCT_MONEY][residence] = totalMoney;
      trendGlobal[GUID_PRODUCT_MONEY] += totalMoney;

      if (influenceGenerator && totalSupply > influenceGenerator) {
        trendResidence[GUID_PRODUCT_INFLUENCE][residence] = amount;
        influenceFromInvestors += amount;
      }
    });

    const level = getCorporationLevelForGlobalPopulation(
      companyLevelData,
      globalPopulation,
    );
    const nextPopulation = getGlobalPopulationForCorporationLevel(
      companyLevelData,
      level + 1,
    );
    const influenceFromPopulation = getInfluenceForCorporationLevel(level);
    let globalInfluence = influenceFromPopulation + influenceFromInvestors;
    Object.entries(trendInfluence).forEach(([key, amount]) => {
      const { data: freeAmount = 0 } = influenceConfigs[key];
      if (amount > freeAmount) {
        globalInfluence += amount;
      }
    });

    const [building, ship] = [trendInputs, trendShip].map(trend =>
      Object.values(trend[GUID_PRODUCT_MONEY]).reduce((total, value) => total + value, 0),
    );

    return {
      trendInputs,
      trendOutputs,
      trendShip,
      trendResidence,
      trendGlobal,
      trendMoney: {
        building,
        ship,
      },
      trendPopulation,
      trendInfluence,
      corporation: {
        globalPopulation,
        level,
        nextPopulation,
        globalInfluence,
        influenceFromPopulation,
        influenceFromInvestors,
      },
    };
  }

  private render(h: CreateElement): VNode {
    const {
      state: {
        influenceConfigs,
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
      trendInputs,
      trendOutputs,
      trendShip,
      trendResidence,
      trendGlobal,
      trendMoney,
      trendPopulation,
      trendInfluence,
      corporation,
    } = trendMaps;

    const statGroups: Group<BaseModel<number>, number>[] = [
      {
        key: GUID_PRODUCT_MONEY,
        label: productMap[GUID_PRODUCT_MONEY].label,
        icon: productMap[GUID_PRODUCT_MONEY].icon,
        data: trendGlobal[GUID_PRODUCT_MONEY],
        items: [
          ...residenceList.map(guid => ({
            key: guid,
            label: residenceMap[guid].label,
            icon: residenceMap[guid].icon,
            data: trendResidence[GUID_PRODUCT_MONEY][guid],
          })),
          {
            key: GUID_TEXT_MAINTENANCE,
            ...labels[GUID_TEXT_MAINTENANCE],
            data: trendMoney.building,
          },
          {
            key: GUID_TEXT_MAINTENANCE_SHIP,
            ...labels[GUID_TEXT_MAINTENANCE_SHIP],
            data: trendMoney.ship,
          },
        ],
      },
      {
        key: GUID_PRODUCT_INFLUENCE,
        label: productMap[GUID_PRODUCT_INFLUENCE].label,
        icon: productMap[GUID_PRODUCT_INFLUENCE].icon,
        data: corporation.globalInfluence,
        items: [
          {
            key: GUID_TEXT_INFLUENCE_FROM_POPULATION,
            ...labels[GUID_TEXT_INFLUENCE_FROM_POPULATION],
            data: corporation.influenceFromPopulation,
          },
          {
            key: GUID_TEXT_INFLUENCE_FROM_INVESTORS,
            ...labels[GUID_TEXT_INFLUENCE_FROM_INVESTORS],
            data: corporation.influenceFromInvestors,
          },
          ...Object.entries(influenceConfigs).map<BaseModel<number>>(([key, conf]) => ({
            key,
            ...conf,
            data: trendInfluence[key],
          })),
        ],
      },
      {
        key: GUID_TEXT_GLOBAL_POPULATION,
        label: productMap[GUID_TEXT_GLOBAL_POPULATION].label,
        icon: productMap[GUID_TEXT_GLOBAL_POPULATION].icon,
        data: corporation.globalPopulation,
        items: [
          ...workforceList.map<BaseModel<number>>(guid => ({
            key: guid,
            label: productMap[guid].label,
            icon: productMap[guid].icon,
            data: trendPopulation[guid],
          })),
        ],
      },
      {
        key: GUID_TEXT_CORPORATION_LEVEL,
        label: productMap[GUID_TEXT_CORPORATION_LEVEL].label,
        icon: productMap[GUID_TEXT_CORPORATION_LEVEL].icon,
        data: corporation.level,
        items: [
          {
            key: GUID_PRODUCT_INFLUENCE,
            label: productMap[GUID_PRODUCT_INFLUENCE].label,
            icon: productMap[GUID_PRODUCT_INFLUENCE].icon,
            data: corporation.globalInfluence,
          },
          {
            key: GUID_TEXT_GLOBAL_POPULATION,
            label: productMap[GUID_TEXT_GLOBAL_POPULATION].label,
            icon: productMap[GUID_TEXT_GLOBAL_POPULATION].icon,
            data: corporation.globalPopulation,
          },
          {
            key: GUID_TEXT_COMPANY_LEVEL_NEXT,
            ...labels[GUID_TEXT_COMPANY_LEVEL_NEXT],
            data: corporation.nextPopulation,
          },
        ],
      },
    ];
    const workforceGroups = workforceList.map<Group<number>>(guid => ({
      key: guid,
      label: productMap[guid].label,
      icon: productMap[guid].icon,
      items: [
        trendGlobal[guid],
        trendPopulation[guid],
        trendPopulation[guid] - trendGlobal[guid],
      ],
    }));

    return (
      <div staticClass="v-calculator" onClick={() => (this.selected = 0)}>
        <div key="stat" staticClass="v-calculator_stat">
          {statGroups.map(group => (
            <div key={group.key} staticClass="v-calculator_stat-item">
              <c-icon staticClass="v-calculator_stat-icon" size={16} icon={group.icon} />
              {formatNumber(group.data as number)}
              <div key="panel" staticClass="v-calculator_stat-panel">
                <div key="global" staticClass="v-calculator_stat-row">
                  <c-icon
                    staticClass="v-calculator_stat-icon"
                    size={24}
                    icon={group.icon}
                  />
                  <span staticClass="v-calculator_stat-label">{group.label}</span>
                  <span staticClass="v-calculator_stat-value">
                    {(group.data || 0).toLocaleString()}
                  </span>
                </div>
                {group.items.map(item => (
                  <div key={item.key} staticClass="v-calculator_stat-row">
                    {item.icon && (
                      <c-icon
                        staticClass="v-calculator_stat-icon"
                        size={6}
                        icon={item.icon}
                      />
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
          {workforceGroups.map(group => (
            <div key={group.key} staticClass="v-calculator_stat-item">
              <c-icon staticClass="v-calculator_stat-icon" size={16} icon={group.icon} />
              {group.items[0].toLocaleString()}
              <div key="panel" staticClass="v-calculator_stat-panel">
                <div key="global" staticClass="v-calculator_stat-row">
                  <c-icon
                    staticClass="v-calculator_stat-icon"
                    size={24}
                    icon={group.icon}
                  />
                  <span staticClass="v-calculator_stat-label">{group.label}</span>
                  <span staticClass="v-calculator_stat-value">
                    {group.items[0].toLocaleString()}
                  </span>
                </div>
                <div key="generation" staticClass="v-calculator_stat-row">
                  <span staticClass="v-calculator_stat-label">
                    {labels[GUID_TEXT_WORKFORCE_GENERATION].label}
                  </span>
                  <span staticClass="v-calculator_stat-value">
                    {group.items[1].toLocaleString()}
                  </span>
                </div>
                <div key="consumption" staticClass="v-calculator_stat-row">
                  <span staticClass="v-calculator_stat-label">
                    {labels[GUID_TEXT_WORKFORCE_CONSUMPTION].label}
                  </span>
                  <span staticClass="v-calculator_stat-value">
                    {group.items[2].toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div key="io" staticClass="v-calculator_wrapper">
          {[
            labels[GUID_TEXT_RESIDENCE].label,
            ...residenceList,
            labels[GUID_TEXT_CONSTRUCTION].label,
            ...buildingList,
            labels[GUID_TEXT_SHIP].label,
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
          <div key="goods" staticClass="v-calculator_label">
            <span staticClass="v-calculator_label-content">
              {labels[GUID_TEXT_GOODS].label}
            </span>
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

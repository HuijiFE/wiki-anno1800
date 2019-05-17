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
  Building,
  ResidenceBuilding7,
  PopulationLevel7,
  PopulationInput,
  Region,
  ConstructionMenu,
  ConstructionCategory,
  ProductionChain,
  ProductionChainNode,
  FactoryBuilding7,
  MaintenanceData,
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
  GUID_REGION_MODERATE,
  GUID_REGION_COLONY01,
  GUID_CONSTRUCTION_MENU,
  GUID_FACTORY_CHARCOAL_BURNER,
  GUID_FACTORY_COAL_MINE,
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
  supplyList: number[];
  workforceList: number[];
  productList: number[];
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
    const supplyList = [GUID_PRODUCT_MONEY, GUID_PRODUCT_INFLUENCE];
    const workforceList = [...GUID_LIST_WORKFORCE];
    const productList = [
      ...(this.$db[GUID_PRODUCT_FILTER] as ProductFilter).productFilter.categories[0]
        .products,
      GUID_PRODUCT_OIL,
    ];
    const productMap: Record<number, BaseModel> = [
      supplyList,
      productList,
      workforceList,
    ].reduce<Record<number, BaseModel>>((agg, list) => {
      list.forEach(
        guid =>
          // eslint-disable-next-line no-param-reassign
          (agg[guid] = {
            label: this.$l10n[guid],
            icon: this.$db[guid].icon,
          }),
      );
      return agg;
    }, {});

    const residenceList: number[] = [...workforceList];
    const residenceMap: Record<number, ModelResidence> = {};

    const isResidence = (a: Asset): a is ResidenceBuilding7 => 'residnece7' in a;
    this.$dbList.filter(isResidence).forEach(residence => {
      const population = this.$db[residence.residnece7.population] as PopulationLevel7;

      const needs = population.population7.inputs.map<ModelResidence['needs'][0]>(ip => ({
        ...ip,
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

    const isConstructionCategory = (a: Asset): a is ConstructionCategory =>
      'constructionCategory' in a;
    const isProductionChain = (a: Asset): a is ProductionChain => 'chain' in a;
    const isBuilding = (a: Asset): a is Building => 'building' in a;
    const isNeedMaintenance = (
      a: Asset | { maintenance: MaintenanceData },
    ): a is Building & { maintenance: MaintenanceData } =>
      'maintenance' in a && !!a.maintenance;
    const isFactory = (a: Asset): a is FactoryBuilding7 => 'factory' in a;
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
      if (!buildingList.includes(guid) && isBuilding(asset) && !isResidence(asset)) {
        if (
          isFactory(asset) ||
          isShipyard(asset) ||
          isNeedMaintenance(asset) ||
          isPublicServiceBuilding(asset)
        ) {
          buildingList.push(guid);
          if (guid === GUID_FACTORY_CHARCOAL_BURNER) {
            resolveBuilding(GUID_FACTORY_COAL_MINE);
          }
          if (isShipyard(asset)) {
            asset.shipyard.assemblyOptions.forEach(ship => {
              if (!shipList.includes(ship)) {
                shipList.push(ship);
              }
            });
          }
        }
        return;
      }
      if (isConstructionCategory(asset)) {
        asset.constructionCategory.buildingList.forEach(resolveBuilding);
      }
      if (isProductionChain(asset)) {
        resolveChainNode(asset.chain);
      }
    };

    // Construction Category Index for: Consumables Materials City Harbour Culture
    [2, 0, 1, 3, 4].forEach(index => {
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
      const asset = this.$db[guid];
      const inputs: [number, number][] = [];
      const outputs: [number, number][] = [];

      if (isShip(asset)) {
        inputs.push([GUID_PRODUCT_MONEY, asset.shipMaintenance]);
        if (asset.cost && asset.cost.influenceCostPoints) {
          inputs.push([GUID_PRODUCT_INFLUENCE, asset.cost.influenceCostPoints]);
        }
      }
      if (isNeedMaintenance(asset)) {
        asset.maintenance.maintenances.forEach(mt =>
          inputs.push([mt.product, mt.amount]),
        );
      }
      if (isFactory(asset)) {
        const { factory } = asset;
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
        amount: 0,
      };
    });

    return {
      supplyList,
      workforceList,
      productList,
      productMap,

      residenceList,
      residenceMap,

      buildingList,
      shipList,
      ioMap,
    };
  }

  public get valueMap(): Record<number, number> {
    const {
      state: {
        supplyList,
        workforceList,
        productList,
        productMap,
        residenceList,
        residenceMap,
        buildingList: factoryList,
        shipList,
        ioMap,
      },
    } = this;

    const result = [...supplyList, ...workforceList, ...productList].reduce<
      Record<number, number>
    >((map, guid) => {
      map[guid] = 0;
      return map;
    }, {});

    [...factoryList].forEach(guid => {
      const { inputs, outputs, amount: ioAmount } = ioMap[guid];
      if (ioAmount === 0) return;
      inputs.forEach(
        ([product, amount]) =>
          (result[product] = (result[product] || 0) - amount * ioAmount),
      );
      outputs.forEach(
        ([product, amount]) =>
          (result[product] = (result[product] || 0) + amount * ioAmount),
      );
    });

    residenceList.forEach(guid => {
      const { needs, amount: residenceAmount } = residenceMap[guid];
      if (residenceAmount === 0) return;
      needs.forEach(nd => {
        // if the amount of the need is 0, means the need is for abstract product
        if (nd.amount > 0) {
          result[nd.product] -= nd.amount * residenceAmount;
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
      if (residenceAmount === 0) return;
      let money = 0;
      let supply = 0;
      needs.forEach(nd => {
        if (
          (nd.amount === 0 && result[nd.product]) ||
          (nd.amount > 0 && result[nd.product] > 0)
        ) {
          money += nd.money;
          supply += nd.supply;
        }
      });
      result[GUID_PRODUCT_MONEY] += money * residenceAmount;
      result[workforce] += Math.min(supply, workforceMax) * residenceAmount;
      if (influenceGenerator && supply > influenceGenerator) {
        result[GUID_PRODUCT_INFLUENCE] += 1 * residenceAmount;
      }
    });

    return result;
  }

  private render(h: CreateElement): VNode {
    const {
      valueMap,
      state: {
        supplyList,
        workforceList,
        productList,
        productMap,
        residenceList,
        residenceMap,
        buildingList,
        shipList,
        ioMap,
      },
    } = this;

    return (
      <div staticClass="v-calculator">
        <div staticClass="v-calculator_ios">
          {[residenceList, buildingList, shipList].map((ios, i) => (
            <div key={i} staticClass="v-calculator_wrapper">
              {ios.map(guid => (
                <v-calc-io
                  key={guid}
                  vModel={(ioMap[guid] || residenceMap[guid]).amount}
                  model-source={ioMap[guid] || residenceMap[guid]}
                  product-map={productMap}
                />
              ))}
            </div>
          ))}
        </div>

        <div staticClass="v-calculator_products">
          {[supplyList, workforceList, productList].map((products, i) => (
            <div key={i} staticClass="v-calculator_wrapper">
              {products.map(guid => (
                <v-calc-product
                  key={guid}
                  model-source={productMap[guid]}
                  value={valueMap[guid]}
                />
              ))}
            </div>
          ))}
        </div>

        <pre>
          {JSON.stringify(
            {
              ...this.state,
              valueMap,
            },
            undefined,
            '  ',
          )}
        </pre>
      </div>
    );
  }
}

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
  PopulationOutput,
  FactoryBuilding7,
} from '@public/db/definition';
import {
  SyncDataView,
  MIXIN_SYNC_DATA_VIEW,
  GUID_PRODUCT_FILTER,
  GUID_PRODUCT_OIL,
  GUID_PRODUCT_MONEY,
  GUID_PRODUCT_INFLUENCE,
  GUID_LIST_WORKFORCE,
} from '@src/utils';
import { BaseModel, Basic, Group } from '@src/components';

interface ModelAmount extends BaseModel {
  amount: number;
}

interface ModelBuilding extends ModelAmount {
  inputs: [number, number][];
  outputs: [number, number][];
}

interface CalculatorState {
  supplyList: number[];
  workforceList: number[];
  productList: number[];
  productMap: Record<number, BaseModel>;

  residenceList: number[];
  factoryList: number[];
  shipList: number[];
  ioMap: Record<number, ModelBuilding>;
}

/**
 * Component: Calculator
 */
@Component({
  mixins: [MIXIN_SYNC_DATA_VIEW],
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
    const factoryList: number[] = [];
    const shipList: number[] = [];
    const ioMap: Record<number, ModelBuilding> = {};

    this.$dbList
      .filter((a): a is ResidenceBuilding7 => 'residnece7' in a)
      .forEach(residence => {
        const inputs: [number, number][] = [];
        const outputs: [number, number][] = [];

        const population = this.$db[residence.residnece7.population] as PopulationLevel7;
        const index = residenceList.indexOf(
          (population.population7.outputs.find(o => o.amount > 0) as PopulationOutput)
            .product,
        );

        let money = 0;
        population.population7.inputs
          .filter(ip => productMap[ip.product])
          .forEach(ip => {
            inputs.push([ip.product, ip.amount * 60]);
            money += ip.mouney;
          });
        outputs.push(
          [residenceList[index], residence.residnece7.max],
          [GUID_PRODUCT_MONEY, money],
        );
        if (residence.residnece7.influenceGenerations.length > 0) {
          outputs.push([GUID_PRODUCT_INFLUENCE, 1]);
        }

        residenceList[index] = residence.guid;
        ioMap[residence.guid] = {
          label: this.$l10n[residence.guid],
          icon: population.icon,
          inputs,
          outputs,
          amount: 0,
        };
      });

    this.$dbList
      .filter((a): a is Building => 'building' in a && !('residnece7' in a))
      .forEach(building => {
        const inputs: [number, number][] = [];
        const outputs: [number, number][] = [];

        const { maintenance, factory } = building as FactoryBuilding7;
        if (maintenance) {
          maintenance.maintenances
            .filter(m => m.amount)
            .forEach(m => inputs.push([m.product, m.amount]));
        }
        if (factory) {
          factory.inputs
            .filter(i => productMap[i.product] && i.amount > 0)
            .forEach(i => inputs.push([i.product, i.amount]));
          factory.outputs
            .filter(o => productMap[o.product] && o.amount > 0)
            .forEach(o => outputs.push([o.product, o.amount]));
        }

        if (inputs.length + outputs.length > 0) {
          factoryList.push(building.guid);
          ioMap[building.guid] = {
            label: this.$l10n[building.guid],
            icon: building.icon,
            inputs,
            outputs,
            amount: 0,
          };
        }
      });

    const factoryMap: Record<number, ModelBuilding> = {};
    const isBuilding = (a: Asset): a is Building => 'building' in a;

    return {
      supplyList,
      workforceList,
      productList,
      productMap,

      residenceList,
      factoryList,
      shipList,
      ioMap,
    };
  }

  private render(h: CreateElement): VNode {
    const {
      supplyList,
      workforceList,
      productList,
      productMap,
      residenceList,
      factoryList,
      shipList,
      ioMap,
    } = this.state;

    return (
      <div staticClass="v-calculator">
        <div staticClass="v-calculator_ios">
          {[residenceList, factoryList, shipList].map((ios, i) => (
            <ul key={i}>
              {ios.map(guid => {
                const io = ioMap[guid];
                return (
                  <li key={guid}>
                    <c-icon icon={io.icon} />
                    <button onClick={() => io.amount--}>-</button>
                    <span>{io.amount}</span>
                    <button onClick={() => io.amount++}>+</button>
                    <ul>
                      <li>{io.label}</li>
                      {io.inputs.map(([ip, amount]) => (
                        <li key={ip}>
                          <c-icon key={ip} icon={productMap[ip].icon} />-
                          {amount * io.amount}
                        </li>
                      ))}
                      {io.outputs.map(([op, amount]) => (
                        <li key={op}>
                          <c-icon key={op} icon={productMap[op].icon} />+
                          {amount * io.amount}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>

        <div staticClass="v-calculator_products">
          {[supplyList, workforceList, productList].map((products, i) => (
            <ul key={i}>
              {products.map(guid => {
                const prod = this.state.productMap[guid];
                return (
                  <li key={guid}>
                    <c-icon icon={prod.icon} />
                    <span>{prod.label}</span>
                    <span>
                      {Object.values(ioMap).reduce(
                        (total, io) =>
                          total -
                          io.inputs.reduce(
                            (subtrahend, [ip, amount]) =>
                              (ip === guid && amount) || subtrahend,
                            0,
                          ) +
                          io.outputs.reduce(
                            (addend, [ip, amount]) => (ip === guid && amount) || addend,
                            0,
                          ),
                        0,
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    );
  }
}

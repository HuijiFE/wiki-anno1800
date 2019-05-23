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
import { PopulationInput } from '@public/db/definition';
import { clamp, GUID_PRODUCT_MONEY, formatNumber } from '@src/utils';
import { BaseModel, Basic, Group } from '@src/components';
import VCalculator, { ModelResidence, ModelIO } from './calculator';

const MAX_AMOUNT = 1000000;

/**
 * Component: Calculator IO
 */
@Component
export class VCalcIo extends Vue {
  @Prop({ type: Number, required: true })
  public readonly guid!: number;

  private onStopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  private onClick(event: MouseEvent): void {
    if (this.$parent.selected === this.guid) {
      this.$parent.selected = 0;
    } else {
      this.$parent.selected = this.guid;
    }
  }

  private change(value: number): void {
    const {
      guid,
      $parent: { amountMap },
    } = this;
    amountMap[guid] = clamp(value, 0, MAX_AMOUNT);
  }

  private onInput(event: Event): void {
    let value = Math.floor(Number(this.$refs.input.value));
    if (Number.isNaN(value)) {
      value = 0;
    }
    this.change(value);
    this.$nextTick(
      () => (this.$refs.input.value = clamp(value, 0, MAX_AMOUNT).toString()),
    );
  }

  public $parent!: VCalculator;

  public $refs!: { input: HTMLInputElement };

  private renderInputsAnOutputs(): VNode {
    const {
      guid,
      $parent: {
        state: { residenceMap, ioMap, productMap },
        amountMap,
        residenceNeedsPauseMap: pauseMap,
      },
    } = this;
    const ioAmount = amountMap[guid];

    if (residenceMap[guid]) {
      const { needs, workforce, workforceMax } = residenceMap[guid];
      return (
        <div key="io-needs" staticClass="v-calc-io_io">
          {([['supply', workforce], ['money', GUID_PRODUCT_MONEY]] as [
            (keyof PopulationInput),
            number
          ][]).map(([prop, prod]) => (
            <div key="supply" staticClass="v-calc-io_io-row">
              <c-icon
                staticClass="v-calc-io_io-icon"
                size={16}
                icon={productMap[prod].icon}
              />
              {productMap[prod].label} +
              {(
                needs.reduce((total, nd) => total + nd[prop], 0) * ioAmount
              ).toLocaleString()}
            </div>
          ))}
          <div key="divider" staticClass="v-calc-io_io-divider" />
          {needs.map(({ product, amount, supply, money }) => [
            <div
              key={product}
              staticClass="v-calc-io_io-row"
              class={{ 'is-paused': pauseMap[guid][product] }}
            >
              <c-icon
                staticClass="v-calc-io_io-icon"
                size={24}
                icon={productMap[product].icon}
              />
              {(amount > 0 && [
                `${productMap[product].label} -${formatNumber(amount * ioAmount)}`,
                <button
                  staticClass="v-calc-io_io-toggle"
                  onClick={() => {
                    pauseMap[guid][product] = !pauseMap[guid][product];
                  }}
                >
                  <c-icon
                    icon={
                      pauseMap[guid][product]
                        ? 'data/ui/2kimages/main/icons/icon_play.png'
                        : 'data/ui/2kimages/main/icons/icon_pause.png'
                    }
                  />
                </button>,
              ]) ||
                productMap[product].label}
            </div>,
            money > 0 && (
              <div key={`${product}-money`} staticClass="v-calc-io_io-row">
                <c-icon
                  staticClass="v-calc-io_io-icon"
                  size={16}
                  icon={productMap[GUID_PRODUCT_MONEY].icon}
                />
                {`${productMap[GUID_PRODUCT_MONEY].label} +${money}`}
              </div>
            ),
            supply > 0 && (
              <div key={`${product}-supply`} staticClass="v-calc-io_io-row">
                <c-icon
                  staticClass="v-calc-io_io-icon"
                  size={16}
                  icon={productMap[workforce].icon}
                />
                {`${productMap[workforce].label} +${supply}`}
              </div>
            ),
            <div key={`${product}-divider`} staticClass="v-calc-io_io-divider" />,
          ])}
        </div>
      );
    }

    const { inputs, outputs } = ioMap[guid];

    return (
      <div key="io" staticClass="v-calc-io_io">
        {inputs.map(([product, amount]) => (
          <div key={product} staticClass="v-calc-io_io-row">
            <c-icon
              staticClass="v-calc-io_io-icon"
              size={16}
              icon={productMap[product].icon}
            />
            {productMap[product].label}
            {amount > 0 && ` -${(amount * ioAmount).toLocaleString()}`}
          </div>
        ))}
        <div key="divider" staticClass="v-calc-io_io-divider" />
        {outputs.map(([product, amount]) => (
          <div key={product} staticClass="v-calc-io_io-row">
            <c-icon
              staticClass="v-calc-io_io-icon"
              size={16}
              icon={productMap[product].icon}
            />
            {productMap[product].label}
            {amount > 0 && ` +${(amount * ioAmount).toLocaleString()}`}
          </div>
        ))}
      </div>
    );
  }

  private render(h: CreateElement): VNode {
    const {
      guid,
      $parent: { amountMap },
    } = this;
    const ioAmount = amountMap[guid];
    const selected = this.$parent.selected === guid;
    const model: ModelResidence | ModelIO =
      this.$parent.state.residenceMap[guid] || this.$parent.state.ioMap[guid];

    return (
      <div
        staticClass="v-calc-io"
        class={{ 'is-selected': selected }}
        onClick={this.onStopPropagation}
      >
        <button
          key="trigger"
          type="button"
          staticClass="v-calc-io_trigger"
          onClick={this.onClick}
        >
          <c-icon staticClass="v-calc-io_icon" icon={model.icon} />
          <span staticClass="v-calc-io_label">
            {(selected && model.label) || ioAmount}
          </span>
        </button>
        {selected && (
          <div key="panel" staticClass="v-calc-io_panel">
            <div staticClass="v-calc-io_wrapper">
              <button
                staticClass="v-calc-io_button"
                onClick={() => this.change(ioAmount - 10)}
              >
                -10
              </button>
              <button
                staticClass="v-calc-io_button"
                onClick={() => this.change(ioAmount - 1)}
              >
                -1
              </button>
              <input
                ref="input"
                staticClass="v-calc-io_input"
                type="text"
                value={ioAmount}
                onInput={this.onInput}
              />
              <button
                staticClass="v-calc-io_button"
                onClick={() => this.change(ioAmount + 1)}
              >
                +1
              </button>
              <button
                staticClass="v-calc-io_button"
                onClick={() => this.change(ioAmount + 10)}
              >
                +10
              </button>
            </div>

            {this.renderInputsAnOutputs()}
          </div>
        )}
      </div>
    );
  }
}

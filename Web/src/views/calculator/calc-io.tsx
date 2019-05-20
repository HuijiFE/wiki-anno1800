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
  @Model('change', { type: Number, required: true })
  public readonly amount!: number;

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
    this.$emit('change', clamp(value, 0, MAX_AMOUNT));
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
    const { guid } = this;
    const { residenceMap, ioMap, productMap } = this.$parent.state;

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
                needs.reduce((total, nd) => total + nd[prop], 0) * this.amount
              ).toLocaleString()}
            </div>
          ))}
          <div key="divider" staticClass="v-calc-io_io-divider" />
          {needs.map(nd => [
            <div key={nd.product} staticClass="v-calc-io_io-row">
              <c-icon
                staticClass="v-calc-io_io-icon"
                size={24}
                icon={productMap[nd.product].icon}
              />
              {(nd.amount > 0 &&
                `${productMap[nd.product].label} -${formatNumber(
                  nd.amount * this.amount,
                )}`) ||
                productMap[nd.product].label}
            </div>,
            nd.money > 0 && (
              <div key={`${nd.product}-money`} staticClass="v-calc-io_io-row">
                <c-icon
                  staticClass="v-calc-io_io-icon"
                  size={16}
                  icon={productMap[GUID_PRODUCT_MONEY].icon}
                />
                {`${productMap[GUID_PRODUCT_MONEY].label} +${nd.money}`}
              </div>
            ),
            nd.supply > 0 && (
              <div key={`${nd.product}-supply`} staticClass="v-calc-io_io-row">
                <c-icon
                  staticClass="v-calc-io_io-icon"
                  size={16}
                  icon={productMap[workforce].icon}
                />
                {`${productMap[workforce].label} +${nd.supply}`}
              </div>
            ),
            <div key={`${nd.product}-divider`} staticClass="v-calc-io_io-divider" />,
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
            {amount > 0 && ` -${(amount * this.amount).toLocaleString()}`}
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
            {amount > 0 && ` +${(amount * this.amount).toLocaleString()}`}
          </div>
        ))}
      </div>
    );
  }

  private render(h: CreateElement): VNode {
    const { guid } = this;
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
            {(selected && model.label) || this.amount}
          </span>
        </button>
        {selected && (
          <div key="panel" staticClass="v-calc-io_panel">
            <div staticClass="v-calc-io_wrapper">
              <button
                staticClass="v-calc-io_button"
                onClick={() => this.change(this.amount - 10)}
              >
                -10
              </button>
              <button
                staticClass="v-calc-io_button"
                onClick={() => this.change(this.amount - 1)}
              >
                -1
              </button>
              <input
                ref="input"
                staticClass="v-calc-io_input"
                type="text"
                value={this.amount}
                onInput={this.onInput}
              />
              <button
                staticClass="v-calc-io_button"
                onClick={() => this.change(this.amount + 1)}
              >
                +1
              </button>
              <button
                staticClass="v-calc-io_button"
                onClick={() => this.change(this.amount + 10)}
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

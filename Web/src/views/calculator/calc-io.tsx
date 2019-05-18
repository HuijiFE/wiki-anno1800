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
import { clamp, GUID_PRODUCT_MONEY, formatNumber } from '@src/utils';
import { BaseModel, Basic, Group } from '@src/components';
import { ModelIO, ModelResidence } from './calculator';

const MAX_AMOUNT = 1000000;

/**
 * Component: Calculator IO
 */
@Component
export class VCalcIo extends Vue {
  @Model('change', { type: Number, required: true })
  public readonly amount!: number;

  @Prop({ type: Object, required: true })
  public readonly modelSource!: ModelResidence | ModelIO;

  @Prop({ type: Object, required: true })
  public readonly productMap!: Record<number, BaseModel>;

  @Prop({ type: Boolean, default: false })
  public readonly selected!: boolean;

  private onStopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  private onClick(event: MouseEvent): void {
    this.$emit(this.selected ? 'unselect' : 'select');
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

  public $refs!: { input: HTMLInputElement };

  private renderInputsAnOutputs(): VNode {
    const { modelSource, productMap } = this;
    if ('needs' in modelSource) {
      const { needs, workforce, workforceMax } = modelSource;
      return (
        <div key="io-needs" staticClass="v-calc-io_io">
          {needs.map(nd => [
            <div key={nd.product} staticClass="v-calc-io_io-row">
              <c-icon
                staticClass="v-calc-io_io-icon"
                size={24}
                icon={productMap[nd.product].icon}
              />
              {(nd.amount > 0 &&
                `${productMap[nd.product].label} -${formatNumber(
                  nd.amount * modelSource.amount,
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

    const { inputs, outputs } = modelSource;

    return (
      <div key="io" staticClass="v-calc-io_io">
        {inputs.map(([product, amount]) => (
          <div key={product} staticClass="v-calc-io_io-row">
            <c-icon
              staticClass="v-calc-io_io-icon"
              size={16}
              icon={productMap[product].icon}
            />
            {(amount > 0 &&
              `${productMap[product].label} -${amount * modelSource.amount}`) ||
              productMap[product].label}
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
            {(amount > 0 &&
              `${productMap[product].label} +${amount * modelSource.amount}`) ||
              productMap[product].label}
          </div>
        ))}
      </div>
    );
  }

  private render(h: CreateElement): VNode {
    return (
      <div
        staticClass="v-calc-io"
        class={{ 'is-selected': this.selected }}
        onClick={this.onStopPropagation}
      >
        <button
          key="trigger"
          type="button"
          staticClass="v-calc-io_trigger"
          onClick={this.onClick}
        >
          <c-icon staticClass="v-calc-io_icon" icon={this.modelSource.icon} />
          <span staticClass="v-calc-io_label">
            {(this.selected && this.modelSource.label) || this.amount}
          </span>
        </button>
        {this.selected && (
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

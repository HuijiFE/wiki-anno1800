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
import { BaseModel, Basic, Group } from '@src/components';
import { ModelIO } from './calculator';

/**
 * Component: Calculator Product
 */
@Component
export class VCalcProduct extends Vue {
  @Prop({ type: Number, required: true })
  public readonly guid!: number;

  @Prop({ type: Object, required: true })
  public readonly product!: BaseModel;

  @Prop({ type: Object, required: true })
  public readonly ioMap!: Record<number, ModelIO>;

  public get amount(): number {
    const { guid } = this;

    return Object.values(this.ioMap).reduce(
      (total, io) =>
        total -
        io.inputs.reduce(
          (inputs, [ip, amount]) =>
            (ip === guid && amount * io.amount + inputs) || inputs,
          0,
        ) +
        io.outputs.reduce(
          (outputs, [op, amount]) =>
            (op === guid && amount * io.amount + outputs) || outputs,
          0,
        ),
      0,
    );
  }

  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-calc-product">
        <c-icon icon={this.product.icon} />
        <span>{this.amount}</span>
      </div>
    );
  }
}

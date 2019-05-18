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
import { formatNumber } from '@src/utils';
import { BaseModel, Basic, Group } from '@src/components';

/**
 * Component: Calculator Product
 */
@Component
export class VCalcProduct extends Vue {
  @Prop({ type: Object, required: true })
  public readonly modelSource!: BaseModel;

  @Prop({ type: Number, required: true })
  public readonly value!: number;

  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-calc-product">
        <c-icon staticClass="v-calc-product_icon" icon={this.modelSource.icon} />
        <span staticClass="v-calc-product_label">{formatNumber(this.value)}</span>
      </div>
    );
  }
}

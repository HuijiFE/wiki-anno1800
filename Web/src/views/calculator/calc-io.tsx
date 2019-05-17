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
import { ModelIO, ModelResidence } from './calculator';

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

  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-calc-io">
        <c-icon icon={this.modelSource.icon} />
        <span>{this.amount}</span>
        <button onClick={() => this.$emit('change', this.amount + 1)}>+</button>
      </div>
    );
  }
}

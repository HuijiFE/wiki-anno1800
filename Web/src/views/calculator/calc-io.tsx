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
import { clamp } from '@src/utils';
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

  private render(h: CreateElement): VNode {
    return (
      <div
        staticClass="v-calc-io"
        class={{ 'is-selected': this.selected }}
        onClick={this.onStopPropagation}
      >
        <button type="button" staticClass="v-calc-io_trigger" onClick={this.onClick}>
          <c-icon staticClass="v-calc-io_icon" icon={this.modelSource.icon} />
          <span staticClass="v-calc-io_label">
            {(this.selected && this.modelSource.label) || this.amount}
          </span>
        </button>
        {this.selected && (
          <div staticClass="v-calc-io_panel">
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
        )}
      </div>
    );
  }
}

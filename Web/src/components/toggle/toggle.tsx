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
import { BaseModel } from '../model';

/**
 * Component: Toggle
 */
@Component
export class CToggle extends Vue {
  @Prop({ type: Boolean, default: false })
  public readonly originalColor!: boolean;

  @Prop({ type: Boolean, default: false })
  public readonly hideIcon!: boolean;

  @Model('toggle', { type: Number, required: true })
  public index!: number;

  @Prop({ type: Array, required: true })
  public readonly itemsSource!: BaseModel[];

  @Prop(Function)
  public readonly itemId?: (item: BaseModel) => string;

  @Prop(Function)
  public readonly itemRole?: (item: BaseModel) => string;

  @Prop(Function)
  public readonly itemAriaControls?: (item: BaseModel) => string;

  private render(h: CreateElement): VNode {
    return (
      <div
        staticClass="c-toggle"
        class={{ 'is-original-color': this.originalColor, 'is-hide-icon': this.hideIcon }}
      >
        {this.itemsSource.map((item, index) => (
          <div key={item.key} staticClass="c-toggle_item">
            <button
              staticClass="c-toggle_button"
              class={{ 'is-selected': this.index === index }}
              onClick={() => {
                if (this.index !== index) {
                  this.$emit('toggle', index);
                }
              }}
              id={this.itemId && this.itemId(item)}
              role={this.itemRole && this.itemRole(item)}
              aria-controls={this.itemAriaControls && this.itemAriaControls(item)}
              aria-selected={this.index === index}
            >
              <c-icon staticClass="c-toggle_icon" icon={item.icon} />
              <span staticClass="c-toggle_label">{item.label}</span>
            </button>
          </div>
        ))}
      </div>
    );
  }
}

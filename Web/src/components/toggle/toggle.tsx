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
  @Model('toggle')
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
      <ul staticClass="c-toggle">
        {this.itemsSource.map((item, index) => (
          <li key={item.key} staticClass="c-toggle_item">
            <button
              staticClass="c-toggle_button"
              class={{ 'is-selected': this.index === index }}
              onClick={() => this.$emit('toggle', index)}
              id={this.itemId && this.itemId(item)}
              role={this.itemRole && this.itemRole(item)}
              aria-controls={this.itemAriaControls && this.itemAriaControls(item)}
              aria-selected={this.index === index}
            >
              <c-icon staticClass="c-toggle_icon" icon={item.icon} />
              <span staticClass="c-toggle_label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    );
  }
}

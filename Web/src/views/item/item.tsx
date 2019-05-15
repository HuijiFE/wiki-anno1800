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

/**
 * Component: Item
 */
@Component
export default class VItem extends Vue {
  private render(h: CreateElement): VNode {
    return <div staticClass="v-item">{this.$slots.default}</div>;
  }
}

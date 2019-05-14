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
 * Component: Info
 */
@Component
export class CInfo extends Vue {
  private render(h: CreateElement): VNode {
    return <div staticClass="c-info">{this.$slots.default}</div>;
  }
}

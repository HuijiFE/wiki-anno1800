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
import { resource } from '@src/utils/resource';

/**
 * Component: Home
 */
@Component
export default class VHome extends Vue {
  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-home">
        {Object.values(this.$db)
          .filter(a => 'product' in a)
          .map(a => (
            <c-icon icon={a.icon} size={64} />
          ))}
      </div>
    );
  }
}

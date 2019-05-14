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
 * Component: Test
 */
@Component
export default class VTest extends Vue {
  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-test">
        <h1>Test</h1>
        <hr />
        <router-link to={`/${this.$route.params.language}/products`}>
          products
        </router-link>
      </div>
    );
  }
}

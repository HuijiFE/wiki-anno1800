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
        <ul>
          {['products', 'items'].map(path => (
            <li>
              <router-link to={this.$routerPath(path)}>{path}</router-link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

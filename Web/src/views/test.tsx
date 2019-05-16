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
import { SyncDataView, MIXIN_SYNC_DATA_VIEW } from '@src/utils';

/**
 * Component: Test
 */
@Component({
  mixins: [MIXIN_SYNC_DATA_VIEW],
})
export default class VTest extends Vue implements SyncDataView<string> {
  public state: string = '';

  public syncData(): string {
    return '';
  }

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

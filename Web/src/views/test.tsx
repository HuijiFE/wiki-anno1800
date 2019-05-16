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
import {} from '@public/db/definition';
import { SyncDataView, MIXIN_SYNC_DATA_VIEW } from '@src/utils';
import { Basic, Group } from '@src/components';

interface TestState {
  test: string;
}

/**
 * Component: Test
 */
@Component({
  mixins: [MIXIN_SYNC_DATA_VIEW],
})
export default class VTest extends Vue implements SyncDataView<TestState> {
  public title(): string {
    return 'Test';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public state: TestState = null as any;

  public syncData(): TestState {
    return { test: 'test' };
  }

  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-test">
        <h1>Test</h1>
        <hr />
        <ul>
          {['calculator', 'products', 'items', 'construction'].map(path => (
            <li>
              <a href={this.$routerPath(path)}>{path}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

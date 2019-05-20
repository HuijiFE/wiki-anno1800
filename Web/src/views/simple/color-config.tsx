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
import { ColorConfig } from '@public/db/definition';
import { SyncDataView, MIXIN_SYNC_DATA_VIEW, GUID_COLOR_CONFIG } from '@src/utils';
import { Basic, Group } from '@src/components';

/**
 * Component: ColorConfig
 */
@Component({
  mixins: [MIXIN_SYNC_DATA_VIEW],
})
export default class VColorConfig extends Vue
  implements SyncDataView<Group<[string, string]>[]> {
  public title(): string {
    return 'Color Config';
  }

  public state!: Group<[string, string]>[];

  public syncData(): Group<[string, string]>[] {
    const groups: Group<[string, string]>[] = [];
    const other: Group<[string, string]> = {
      label: 'other',
      items: [],
    };

    const convertName = (name: string): string =>
      name
        .replace(/([A-Z]|\d+)/g, '-$1')
        .replace(/^-/, '$')
        .toLowerCase();

    const colorConfig = this.$db[GUID_COLOR_CONFIG] as ColorConfig;
    Object.entries(colorConfig.colorConfig).forEach(([category, map]) => {
      if (typeof map === 'string') {
        other.items.push([convertName(category), `#${map}`]);
      } else {
        groups.push({
          label: category,
          items: Object.keys(map)
            .sort()
            .map(name => [convertName(name), `#${map[name]}`]),
        });
      }
    });
    groups.push(other);

    return groups;
  }

  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-color-config">
        {this.state.map(group => (
          <div staticClass="v-color-config_wrapper">
            <h2 staticClass="v-color-config_category">{group.label}</h2>
            <ul>
              {group.items.map(([color, value]) => (
                <li>
                  <code staticClass="v-color-config_content">
                    <span staticClass="v-color-config_identifier">{color}</span>
                    {': '}
                    <span
                      staticClass="v-color-config_block"
                      style={{
                        backgroundColor: value,
                      }}
                    />
                    <span staticClass="v-color-config_literal">{value}</span>
                  </code>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

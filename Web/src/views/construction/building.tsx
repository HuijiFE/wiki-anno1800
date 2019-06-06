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
import { Building } from '@public/db/definition';
import { SyncDataView, MIXIN_SYNC_DATA_VIEW, resource } from '@src/utils';
import { Basic, Group } from '@src/components';

interface BuildingState {
  guid: number;
  name: string;
  icon: string;
  label: string;
  description: string;

  infos: Group<Group<Basic>>[];
}

/**
 * Component: Building
 */
@Component({
  mixins: [MIXIN_SYNC_DATA_VIEW],
})
export default class VBuilding extends Vue implements SyncDataView<BuildingState> {
  public title(): string {
    return this.state.label;
  }

  public state!: BuildingState;

  public syncData(): BuildingState {
    const guid = Number.parseInt(this.$route.params.guid, 10);
    const building = this.$db[guid] as Building;
    if (!building) {
      throw new Error(`Building(guid: ${guid}) not found`);
    }
    const { icon = '', name = '' } = building;
    const label = this.$l10n[guid] || '';
    const description = (building.description && this.$l10n[building.description]) || '';

    return {
      guid,
      name,
      icon,
      label,
      description,
      infos: [],
    };
  }

  private render(h: CreateElement): VNode {
    const { guid, name, icon, label, description, infos } = this.state;

    return (
      <div staticClass="v-building" data-guid={guid} data-name={name}>
        {!!icon && (
          <div staticClass="v-building_icon-container" key="icon">
            <img
              staticClass="v-building_icon"
              src={resource(this.state.icon)}
              alt={this.state.label}
            />
          </div>
        )}
        <div staticClass="v-building_label">{label}</div>
        <div staticClass="v-building_description">{description}</div>
      </div>
    );
  }
}

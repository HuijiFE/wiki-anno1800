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
import { Building, Region } from '@public/db/definition';
import {
  SyncDataView,
  MIXIN_SYNC_DATA_VIEW,
  resource,
  GUID_REGION_MODERATE,
  GUID_REGION_COLONY01,
} from '@src/utils';
import { BaseModel, Basic, Group } from '@src/components';

interface BuildingState {
  guid: number;
  name: string;
  icon: string;
  label: string;
  description: string;
  category: string;
  sub: Basic[];

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
    const regionMap: Record<string, Basic> = {};
    [GUID_REGION_MODERATE, GUID_REGION_COLONY01]
      .map(guid => this.$db[guid] as Region)
      .forEach(
        rg =>
          (regionMap[rg.region.id] = {
            label: this.$l10n[rg.guid],
            icon: rg.icon,
            data: rg.region.id,
            link: this.$routerPath('region', rg.guid),
          }),
      );

    const guid = Number.parseInt(this.$route.params.guid, 10);
    const building = this.$db[guid] as Building;
    if (!building) {
      throw new Error(`Building(guid: ${guid}) not found`);
    }
    const { icon = '', name = '' } = building;
    const label = this.$l10n[guid] || '';
    const description = (building.description && this.$l10n[building.description]) || '';
    const category =
      (building.building.category && this.$l10n[building.building.category]) || '';
    const regions = building.building.regions.map(rg => regionMap[rg]).filter(rg => !!rg);

    return {
      guid,
      name,
      icon,
      label,
      description,
      category,
      sub: regions,
      infos: [],
    };
  }

  private renderInfo(info: BaseModel | Basic): VNode {
    const content = [
      !!info.icon && <img staticClass="v-building_info-icon" src={resource(info.icon)} />,
      !!info.label && <span staticClass="v-building_info-content">{info.label}</span>,
    ];
    return (
      <span staticClass="v-building_info">
        {('link' in info && (
          <a staticClass="v-building_info-link" href={info.link}>
            {content}
          </a>
        )) ||
          content}
      </span>
    );
  }

  private render(h: CreateElement): VNode {
    const {
      guid,
      name,
      icon,
      label,
      description,
      category,
      sub: regions,
      infos,
    } = this.state;

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

        <div staticClass="v-building_sub">
          {!!category && [category, <c-divider-slash />]}
          {regions.length > 0 &&
            regions.map(rg => [this.renderInfo(rg), <c-divider-slash />])}
        </div>

        <pre>{JSON.stringify(this.state, undefined, '  ')}</pre>
      </div>
    );
  }
}

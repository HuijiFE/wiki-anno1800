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
import { BaseModel } from '@src/components';

/**
 * Component: Asset
 */
@Component({
  mixins: [MIXIN_SYNC_DATA_VIEW],
})
export default class VAsset extends Vue implements SyncDataView<BaseModel> {
  public title(): string {
    return this.state.label;
  }

  public state!: BaseModel;

  public syncData(): BaseModel {
    const { guid } = this.$route.params;
    const { icon, description } = this.$db[guid];

    const model: BaseModel = {
      label: this.$l10n[guid],
    };
    if (icon) {
      model.icon = icon;
    }
    if (description) {
      model.description = this.$l10n[description];
    }

    return model;
  }

  private render(h: CreateElement): VNode {
    return (
      <div staticClass="v-asset">
        <div staticClass="v-asset_icon">
          <c-icon icon={this.state.icon} />
        </div>
        <div staticClass="v-asset_label">{this.state.label}</div>
        <div staticClass="v-asset_description">{this.state.description}</div>
      </div>
    );
  }
}

import Vue, { CreateElement, VNode, FunctionalComponentOptions } from 'vue';
import {
  Component,
  Emit,
  Inject,
  Model,
  Prop,
  Provide,
  Watch,
} from 'vue-property-decorator';
import { resource } from '@src/utils';
import { RecordPropsDefinition } from 'vue/types/options';

@Component
export class CIcon extends Vue {
  @Prop(String)
  public readonly icon?: string;

  @Prop([String, Number])
  public readonly size?: string | number;

  private render(h: CreateElement): VNode {
    return h('img', {
      staticClass: 'c-icon',
      class: [`cp-size_${this.size}`],
      attrs: {
        src: resource(
          (this.icon && this.icon) || 'data/ui/2kimages/main/icons/icon_questionmark.png',
        ),
      },
    });
  }
}

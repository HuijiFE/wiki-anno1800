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
import { ENV } from '@src/utils';

/**
 * Component: App
 */
@Component
export default class VApp extends Vue {
  private render(h: CreateElement): VNode {
    return (
      <div
        id="app"
        staticClass="v-app c-reset"
        class={[`vp-platform_${ENV.APP_PLATFORM}`]}
        data-server-rendered="true"
        data-language={this.$route.params.language}
      >
        <router-view staticClass="v-app_wrapper" />
      </div>
    );
  }
}

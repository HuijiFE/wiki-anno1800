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
 * Component: App
 */
@Component
export default class VApp extends Vue {
  private render(h: CreateElement): VNode {
    const isDev = process.env.NODE_ENV === 'development';
    return (
      <div
        staticClass="v-app"
        class={{ 'is-development': isDev }}
        data-language={this.$route.params.language}
      >
        <router-view staticClass="v-app_wrapper" class={{ 'is-development': isDev }} />
      </div>
    );
  }
}

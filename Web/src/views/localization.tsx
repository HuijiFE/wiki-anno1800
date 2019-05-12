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
 * Component: Localization
 */
@Component
export default class VLocalization extends Vue {
  private render(h: CreateElement): VNode {
    return <router-view data-language={this.$route.params.language} />;
  }
}

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
import { resource } from '@src/utils';

/**
 * Component: Home
 */
@Component
export default class VHome extends Vue {
  private render(h: CreateElement): VNode {
    return <div staticClass="v-home">home</div>;
  }
}

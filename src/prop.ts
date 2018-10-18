import { PropOptions } from "vue";
import { createDecorator, VueDecorator } from "vue-class-component";
import { Constructor } from "./main";

export function Prop(options: (PropOptions | Constructor[] | Constructor) = {}): VueDecorator {
    return createDecorator((componentOptions, k) => {
      (componentOptions.props || (componentOptions.props = {}) as any)[k] = options;
    });
  }
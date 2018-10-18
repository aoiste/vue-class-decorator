import { PropOptions } from "vue";
import { createDecorator, VueDecorator } from "vue-class-component";
import { Constructor } from "./main";

export function Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {}): VueDecorator {
    return createDecorator((componentOptions, k) => {
        (componentOptions.props || (componentOptions.props = {}) as any)[k] = options;
        componentOptions.model = { prop: k, event: event || k };
    });
}
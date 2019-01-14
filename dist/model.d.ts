import { PropOptions } from "vue";
import { VueDecorator } from "vue-class-component";
import { Constructor } from "./main";
export declare function Model(event?: string, options?: (PropOptions | Constructor[] | Constructor)): VueDecorator;

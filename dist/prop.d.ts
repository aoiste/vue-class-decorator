import { PropOptions } from "vue";
import { VueDecorator } from "vue-class-component";
import { Constructor } from "./main";
export declare function Prop(options?: (PropOptions | Constructor[] | Constructor)): VueDecorator;

import { VueDecorator } from "vue-class-component";
import { InjectKey } from "vue/types/options";
export declare function Inject(options?: {
    from?: InjectKey;
    default?: any;
} | InjectKey): VueDecorator;

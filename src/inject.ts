import { createDecorator, VueDecorator } from "vue-class-component";
import { InjectKey } from "vue/types/options";

export function Inject(options?: { from?: InjectKey, default?: any } | InjectKey): VueDecorator {
    return createDecorator((componentOptions, key) => {
        if (typeof componentOptions.inject === "undefined") {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject[key] = options || key;
        }
    });
}
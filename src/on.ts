import { createDecorator, VueDecorator } from "vue-class-component";

// code copied from Vue/src/shared/util.js
const hyphenateRE: RegExp = /\B([A-Z])/g;
const hyphenate: (str: string) => string = (str: string) => str.replace(hyphenateRE, "-$1").toLowerCase();

export function On(event?: string): VueDecorator {
    return createDecorator((componentOptions, key) => {
        let mounted: Function | undefined = componentOptions.mounted;
        let methods: any = componentOptions.methods;
        let handler: Function = methods[key];
        componentOptions.mounted = function(this: any): void {
            this.$on(event || hyphenate(key), handler);
            if(typeof mounted === "function") {
                mounted.call(this);
            }
        };
        delete methods[key];
    });
}
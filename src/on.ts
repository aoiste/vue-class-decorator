import { createDecorator, VueDecorator } from "vue-class-component";

export function On(event: string): VueDecorator {
    return createDecorator((componentOptions, key) => {
        let mounted: Function | undefined = componentOptions.mounted;
        let methods: any = componentOptions.methods;
        let handler: Function = methods[key];
        componentOptions.mounted = function(this: any): void {
            this.$on(event || key, handler);
            if(typeof mounted === "function") {
                mounted.call(this);
            }
        };
        delete methods[key];
    });
}
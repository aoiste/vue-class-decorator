import { createDecorator, VueDecorator } from "vue-class-component";

export function Mounted(): VueDecorator {
    return createDecorator((componentOptions, key) => {
        let mounted: Function | undefined = componentOptions.mounted;
        let methods: any = componentOptions.methods;
        let todo: Function = methods[key];
        componentOptions.mounted = function(this: any): void {
            todo.call(this);
            if(typeof mounted === "function") {
                mounted.call(this);
            }
        };
    });
}
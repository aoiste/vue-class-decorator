import { createDecorator, VueDecorator } from "vue-class-component";

export function Filter(name: string): VueDecorator {
    return createDecorator((componentOptions, handler) => {
        if (typeof componentOptions.filters !== "object") {
            componentOptions.filters = Object.create(null);
        }
        let methods: any = componentOptions.methods;
        (componentOptions.filters as any)[name || handler] = methods[handler];
    });
}
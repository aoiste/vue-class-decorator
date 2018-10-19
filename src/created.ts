import { createDecorator, VueDecorator } from "vue-class-component";

export function Created(): VueDecorator {
    return createDecorator((componentOptions, key) => {
        let created: Function | undefined = componentOptions.created;
        let methods: any = componentOptions.methods;
        let todo: Function = methods[key];
        componentOptions.created = function(this: any): void {
            todo.call(this);
            if(typeof created === "function") {
                created.call(this);
            }
        };
    });
}
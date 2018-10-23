import { createDecorator, VueDecorator } from "vue-class-component";

type KeyPair = [string, number];

export function Mounted(order?: number): VueDecorator {
    return createDecorator((componentOptions, key) => {
        let mounted: any = componentOptions.mounted;
        if(typeof mounted !== "function" || !mounted.todos) {
            // tslint:disable-next-line:no-empty
            const original: any = componentOptions.mounted ? componentOptions.mounted : () => {};
            const methods: any = componentOptions.methods;

            mounted = componentOptions.mounted = function(this: any): void {
                mounted.todos
                .filter((x: KeyPair) => x[1])
                .sort((a: KeyPair, b: KeyPair) => a[1] - b[1])
                .map((x: KeyPair) => methods[x[0]].call(this));

                mounted.todos
                .filter((x: KeyPair) => !x[1])
                .map((x: KeyPair) => methods[x[0]].call(this));

                original.call(this);
            };

            mounted.todos = [];
        }

        mounted.todos.push([key, order]);
    });
}
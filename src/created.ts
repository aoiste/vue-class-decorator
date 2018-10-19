import { createDecorator, VueDecorator } from "vue-class-component";

type KeyPair = [string, number];

export function Created(order?: number): VueDecorator {
    return createDecorator((componentOptions, key) => {
        let created: any = componentOptions.created;
        if(typeof created !== "function" || !created.todos) {
            const original: any = componentOptions.created;
            const methods: any = componentOptions.methods;

            created = componentOptions.created = function(this: any): void {
                original.todos
                .filter((x: KeyPair) => x[1])
                .sort((a: KeyPair, b: KeyPair) => a[1] - b[1])
                .map((x: KeyPair) => methods[x[0]].call(this));

                original.todos
                .filter((x: KeyPair) => !x[1])
                .map((x: KeyPair) => methods[x[0]].call(this));

                created.call(this);
            };

            created.todos = [];
        }

        created.todos.push([key, order]);
    });
}
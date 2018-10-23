import { createDecorator, VueDecorator } from "vue-class-component";

type KeyPair = [string, number];
type HookDecorator = (order?: number, ...args: any) => VueDecorator;

function HookFactory(stage: string): HookDecorator {
    return function _stage(order?: number, ...args: any): VueDecorator {
        return createDecorator((componentOptions: any, key) => {
            let _stage: any = componentOptions[stage];
            if(typeof _stage !== "function" || !_stage.todos) {
                // tslint:disable-next-line:no-empty
                const original: any = componentOptions[stage] ? componentOptions[stage] : () => {};
                const methods: any = componentOptions.methods;

                _stage = componentOptions[stage] = function(this: any): void {
                    _stage.todos
                    .filter((x: KeyPair) => x[1])
                    .sort((a: KeyPair, b: KeyPair) => a[1] - b[1])
                    .map((x: KeyPair) => methods[x[0]].call(this, ...args));

                    _stage.todos
                    .filter((x: KeyPair) => !x[1])
                    .map((x: KeyPair) => methods[x[0]].call(this, ...args));

                    original.call(this);
                };

                _stage.todos = [];
            }

            _stage.todos.push([key, order]);
        });
    };
}

export const Mounted: HookDecorator = HookFactory("mounted");
export const Created: HookDecorator = HookFactory("created");
import { createDecorator, VueDecorator } from "vue-class-component";

type KeyPair = [string, number, any[]];
type HookDecorator = (order?: number | any[], args?: any[]) => VueDecorator;

function HookFactory(stage: string): HookDecorator {
    return function _stage(order?: number | any[], args: any[] = []): VueDecorator {
        if (Array.isArray(order)) {
            args = order;
            order = undefined;
        }
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
                    .map((x: KeyPair) => methods[x[0]].call(this, ...x[2]));

                    _stage.todos
                    .filter((x: KeyPair) => !x[1])
                    .map((x: KeyPair) => methods[x[0]].call(this, ...x[2]));

                    original.call(this);
                };

                _stage.todos = [];
            }

            _stage.todos.push([key, order, args]);
        });
    };
}


export const BeforeCreate: HookDecorator = HookFactory("beforeCreate");
export const Created: HookDecorator = HookFactory("created");
export const BeforeMount: HookDecorator = HookFactory("beforeMount");
export const Mounted: HookDecorator = HookFactory("mounted");
export const BeforeUpdate: HookDecorator = HookFactory("beforeUpdate");
export const Updated: HookDecorator = HookFactory("updated");
export const Activated: HookDecorator = HookFactory("activated");
export const Deactivated: HookDecorator = HookFactory("deactivated");
export const BeforeDestroy: HookDecorator = HookFactory("beforeDestroy");
export const Destroyed: HookDecorator = HookFactory("destroyed");
export const ErrorCaptured: HookDecorator = HookFactory("errorCaptured");
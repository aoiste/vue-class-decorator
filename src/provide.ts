import { createDecorator, VueDecorator } from "vue-class-component";

export function Provide(key?: string | symbol): VueDecorator {
    return createDecorator((componentOptions, k) => {
        let provide: any = componentOptions.provide;
        if (typeof provide !== "function" || !provide.managed) {
            const original: any = componentOptions.provide;

            provide = componentOptions.provide = function (this: any): any {
                let rv: any = Object.create((typeof original === "function" ? original.call(this) : original) || null);
                // tslint:disable-next-line:forin
                for (let i in provide.managed) {
                    rv[provide.managed[i]] = this[i];
                }
                return rv;
            };

            provide.managed = {};
        }
        provide.managed[k] = key || k;
    });
}
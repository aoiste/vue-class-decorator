import Vue from "vue";
// code copied from Vue/src/shared/util.js
const hyphenateRE: RegExp = /\B([A-Z])/g;
const hyphenate: (str: string) => string = (str: string) => str.replace(hyphenateRE, "-$1").toLowerCase();

export function Emit(event?: string): MethodDecorator {
    return function (_target: any, key: string | symbol, descriptor: any): void {
        if (typeof key === "string") {
            key = hyphenate(key);
        }

        const original: any = descriptor.value;
        descriptor.value = function emitter(...args: any[]): void {
            const emit: ((returnValue: any) => void) = (returnValue: any) => {
                if (returnValue !== undefined) { args.unshift(returnValue); }
                this.$emit(event || key, ...args);
            };

            const returnValue: any = original.apply(this, args);

            if (isPromise(returnValue)) {
                returnValue.then(returnValue => {
                    emit(returnValue);
                });
            } else {
                emit(returnValue);
            }
        };
    };
}

function isPromise(obj: any): obj is Promise<any> {
    return obj instanceof Promise || (obj && typeof obj.then === "function");
}
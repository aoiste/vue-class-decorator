export const _: any = Object.create({
    vue_class_decorator_placeholder: true
});

export function IfPlaceholder(test: any): boolean {
    if(test === undefined || test === null) {
        return false;
    }

    return !!test.vue_class_decorator_placeholder;
}
import { createDecorator, VueDecorator } from "vue-class-component";

export function Cache(cache: boolean = true): VueDecorator {
    return createDecorator((options, key) => {
        // component options should be passed to the callback
        // and update for the options object affect the component
        let computed: any = options.computed;
        computed[key].cache = cache;
    });
}

export const NoCache: VueDecorator = Cache(false);
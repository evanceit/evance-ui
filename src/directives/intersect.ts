import {DirectiveBinding} from "vue/dist/vue";
import {Browser} from "@/util";


type ObserverHandler = (
    isIntersecting: boolean,
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
) => void;


export interface ObserverDirectiveBinding extends Omit<DirectiveBinding, 'modifiers' | 'value'> {
    value?: ObserverHandler | { handler: ObserverHandler, options?: IntersectionObserverInit },
    modifiers: {
        once?: boolean,
        quiet?: boolean
    }
}

/**
 * # Mounted
 */
function mounted(el: HTMLElement, binding: ObserverDirectiveBinding) {
    if (!Browser.supportsIntersection) {
        return;
    }
    const modifiers = binding.modifiers || {};
    const value = binding.value;
    const { handler, options } = typeof value === 'object' ? value : { handler: value, options: {} };

    const observer = new IntersectionObserver((
        entries: IntersectionObserverEntry[] = [],
        observer: IntersectionObserver
    ) => {
        const _observe = el._observe?.[binding.instance!.$.uid];
        // Just in case, should never fire
        if (!_observe) {
            return;
        }
        const isIntersecting = entries.some(entry => entry.isIntersecting);

        // If is not quiet or has already been initialized, invoke the user callback
        if (
            handler
            && (!modifiers.quiet || _observe.init)
            && (!modifiers.once || isIntersecting || _observe.init)
        ) {
            handler(isIntersecting, entries, observer);
        }

        if (isIntersecting && modifiers.once) {
            unmounted(el, binding);
        } else {
            _observe.init = true;
        }
    }, options);

    el._observe = Object(el._observe);
    el._observe![binding.instance!.$.uid] = { init: false, observer };

    observer.observe(el);
}

/**
 * # Unmounted
 */
function unmounted(el: HTMLElement, binding: ObserverDirectiveBinding) {
    const observe = el._observe?.[binding.instance!.$.uid];
    if (!observe) {
        return;
    }
    observe.observer.unobserve(el);
    delete el._observe![binding.instance!.$.uid];
}

export const Intersect = {
    mounted,
    unmounted,
}

export default Intersect;
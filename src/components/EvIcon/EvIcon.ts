import {computed, toRaw} from "vue";

/**
 * ## Icon Size
 */
export type IconSize = 'small'
    | 'medium'
    | 'large';

export function useIcon(props, name: string) {
    return computed(() => {
        return toRaw(props[name]);
    });
}
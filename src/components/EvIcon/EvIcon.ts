import {computed, toRaw} from "vue";

export function useIcon(props, name: string) {
    return computed(() => {
        return toRaw(props[name]);
    });
}
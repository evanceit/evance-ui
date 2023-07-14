import {inject, InjectionKey, Ref} from "vue";

/**
 * # List Key
 */
export const ListKey: InjectionKey<{
    hasPrepend: Ref<boolean>
    updateHasPrepend: (value: boolean) => void
}> = Symbol.for('ev:list');


/**
 * # Use List
 */
export function useList() {
    return inject(ListKey, null);
}
import { inject, InjectionKey, provide, Ref, shallowRef } from "vue";

/**
 * # List Key
 */
export const ListKey: InjectionKey<{
    hasPrepend: Ref<boolean>;
    updateHasPrepend: (value: boolean) => void;
}> = Symbol.for("ev:list");

/**
 * # Create List
 * @see useList
 */
export function createList() {
    const defaultValue = {
        hasPrepend: shallowRef(false),
        updateHasPrepend: () => null,
    };
    const parent = inject(ListKey, defaultValue);
    const data = {
        hasPrepend: shallowRef(false),
        updateHasPrepend: (value: boolean) => {
            if (value) {
                data.hasPrepend.value = value;
            }
        },
    };
    provide(ListKey, data);
    return parent;
}

/**
 * # Use List
 *
 * @see createList
 */
export function useList() {
    return inject(ListKey, null);
}

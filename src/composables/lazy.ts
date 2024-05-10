import { propsFactory } from "@/util";
import { computed, Ref, shallowRef, watch } from "vue";

export const makeLazyProps = propsFactory(
    {
        eager: Boolean,
    },
    "lazy",
);

/**
 * # useLazy
 *
 * @param props
 * @param active
 */
export function useLazy(props: { eager: boolean }, active: Ref<boolean>) {
    const isBooted = shallowRef(false);
    const hasContent = computed(
        () => isBooted.value || props.eager || active.value,
    );

    watch(active, () => (isBooted.value = true));

    function onAfterLeave() {
        if (!props.eager) {
            isBooted.value = false;
        }
    }

    return { isBooted, hasContent, onAfterLeave };
}

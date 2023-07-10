import {computed, ComputedRef} from "vue";

/**
 * # Has slot with content
 *
 * Determines whether the `slotName` is present within the supplied list of `slots`
 * and whether it has content.
 *
 * @param slots
 * @param slotName
 */
export function hasSlotWithContent(slots, slotName: string): ComputedRef {
    return computed(() => {
        if (!slots[slotName]) {
            return false;
        }
        const slot = slots[slotName]();
        if (!slot.length) {
            return false;
        }
        return slot.some((node) => {
            return !!node.children.length;
        });
    });
}
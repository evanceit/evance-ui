import { propsFactory } from "@/util";
import { PropType } from "vue";
import { makeDimensionsProps } from "@/composables/dimensions";
import { makeComponentProps } from "@/composables/component";
import { makeVirtualProps } from "@/composables/virtual";

export interface EvVirtualScrollSlot<T> {
    item: T;
    index: number;
}

/**
 * # Make EvVirtualScroll Props
 */
export const makeEvVirtualScrollProps = propsFactory(
    {
        items: {
            type: Array as PropType<readonly unknown[]>,
            default: () => [],
        },
        renderless: Boolean,

        ...makeVirtualProps(),
        ...makeComponentProps(),
        ...makeDimensionsProps(),
    },
    "EvVirtualScroll",
);

/**
 * # Make EvVirtualScrollItem Props
 */
export const makeEvVirtualScrollItemProps = propsFactory(
    {
        renderless: Boolean,
        ...makeComponentProps(),
    },
    "EvVirtualScrollItem",
);

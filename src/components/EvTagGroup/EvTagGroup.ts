import { isDeepEqual, propsFactory } from "@/util";
import { makeTagProps } from "@/composables/tag.ts";
import { makeComponentProps } from "@/composables/component.ts";
import { PropType } from "vue";
import { makeGroupProps } from "@/composables/group.ts";
import { makeEvSlideGroupProps } from "@/components/EvSlideGroup/EvSlideGroup.ts";

export const EvTagGroupSymbol = Symbol.for("ev:tag-group");

export type EvTagGroupSlots = {
    default: {
        isSelected: (id: number) => boolean;
        select: (id: number, value: boolean) => void;
        next: () => void;
        prev: () => void;
        selected: readonly number[];
    };
};

/**
 * # makeEvTagGroupProps
 */
export const makeEvTagGroupProps = propsFactory(
    {
        column: Boolean,
        filter: Boolean,
        valueComparator: {
            type: Function as PropType<typeof isDeepEqual>,
            default: isDeepEqual,
        },

        ...makeEvSlideGroupProps(),
        ...makeComponentProps(),
        ...makeGroupProps({
            selectedClass: "is-selected",
            selectedAppearance: "primary",
            selectedVariant: "outlined",
        }),
        ...makeTagProps(),
    },
    "EvTagGroup",
);

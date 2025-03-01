import { isDeepEqual, propsFactory } from "@/util";
import { makeTagProps } from "@/composables/tag";
import { makeComponentProps } from "@/composables/component";
import { PropType } from "vue";
import { makeGroupProps } from "@/composables/group";
import { makeEvSlideGroupProps } from "@/components/EvSlideGroup/EvSlideGroup";

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

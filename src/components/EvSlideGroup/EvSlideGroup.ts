import { InjectionKey, PropType } from "vue";
import { GroupProvide, makeGroupProps } from "@/composables/group";
import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeTagProps } from "@/composables/tag";
import { IconProp } from "@/composables/icons";
import { VisibilityRuleProp } from "@/composables/display";

export const EvSlideGroupSymbol: InjectionKey<GroupProvide> =
    Symbol.for("ev:slide-group");

export interface SlideGroupSlot {
    next: GroupProvide["next"];
    previous: GroupProvide["previous"];
    select: GroupProvide["select"];
    isSelected: GroupProvide["isSelected"];
}

export type EvSlideGroupSlot = {
    default: SlideGroupSlot;
    previous: SlideGroupSlot;
    next: SlideGroupSlot;
};

export const makeEvSlideGroupProps = propsFactory(
    {
        arrowsAlign: {
            type: String as PropType<"start" | "end" | "around">,
            default: "around",
        },
        arrowsHidden: [Boolean, String, Array] as PropType<VisibilityRuleProp>,
        centerActive: Boolean,
        direction: {
            type: String as PropType<"horizontal" | "vertical">,
            default: "horizontal",
        },
        iconNext: IconProp,
        iconPrevious: IconProp,
        symbol: {
            type: null,
            default: EvSlideGroupSymbol,
        },

        ...makeComponentProps(),
        ...makeTagProps(),
        ...makeGroupProps({
            selectedClass: "is-active",
        }),
    },
    "EvSlideGroup",
);

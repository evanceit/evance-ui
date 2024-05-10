import { InjectionKey, PropType } from "vue";
import { GroupProvide, makeGroupProps } from "@/composables/group.ts";
import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeTagProps } from "@/composables/tag.ts";
import { IconProp } from "@/composables/icons.ts";
import { VisibilityRuleProp } from "@/composables/display.ts";

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

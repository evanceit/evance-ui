import { makeAppearanceProps, propsFactory } from "@/util";
import { IconProp } from "@/composables/icons";
import { makeComponentProps } from "@/composables/component";
import { makePositionProps } from "@/composables/position";
import { makeEvTransitionProps } from "@/components/EvTransition";

export const makeEvBadgeProps = propsFactory(
    {
        icon: IconProp,
        bordered: Boolean,
        content: [Number, String],
        dot: Boolean,
        floating: Boolean,
        max: [Number, String],
        bold: Boolean,
        inline: Boolean,
        modelValue: {
            type: Boolean,
            default: true,
        },
        offsetX: [Number, String],
        offsetY: [Number, String],
        pulsate: Boolean,

        ...makeComponentProps(),
        ...makePositionProps({
            position: "top end",
        } as const),
        ...makeAppearanceProps(),
        ...makeEvTransitionProps({
            transition: "scale-rotate-transition",
        }),
    },
    "EvBadge",
);

import {makeAppearanceProps, propsFactory} from "@/util";
import {IconValue} from "@/composables/icons.ts";
import {makeComponentProps} from "@/composables/component.ts";
import {makePositionProps} from "@/composables/position.ts";
import {makeEvTransitionProps} from "@/components";


export const makeEvBadgeProps = propsFactory({
    icon: IconValue,
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
        position: 'top end'
    } as const),
    ...makeAppearanceProps(),
    ...makeEvTransitionProps({
        transition: 'scale-rotate-transition'
    })

}, 'EvBadge');
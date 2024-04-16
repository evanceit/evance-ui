import {EventProp, propsFactory} from "@/util";
import {makeTagProps} from "@/composables/tag.ts";
import {makeComponentProps} from "@/composables/component.ts";
import {makeGroupItemProps} from "@/composables/groupItem.ts";
import {makeRoundedProps} from "@/composables/rounded.ts";
import {IconProp} from "@/composables/icons.ts";
import {Check} from "@/icons";

export type EvTagSlots = {
    default: {
        isSelected: boolean | undefined,
        selectedClass: boolean | (string | undefined)[] | undefined,
        select: ((value: boolean) => void) | undefined,
        toggle: (() => void) | undefined,
        value: unknown,
        disabled: boolean
    },
    label: never,
    prefix: never,
    suffix: never,
    filter: never
}

export const makeEvTagProps = propsFactory({
    activeClass: String,
    closable: Boolean,
    draggable: Boolean,
    filter: Boolean,
    iconEnd: IconProp,
    iconFilter: {
        type: IconProp,
        default: Check
    },
    iconStart: IconProp,
    label: Boolean,
    link: {
        type: Boolean,
        default: undefined,
    },
    modelValue: {
        type: Boolean,
        default: true
    },
    text: String,

    onClick: EventProp<[MouseEvent]>(),
    onClickOnce: EventProp<[MouseEvent]>(),

    ...makeGroupItemProps(),
    ...makeComponentProps(),
    ...makeRoundedProps(),
    ...makeTagProps({ tag: 'span' })

}, 'EvTag');
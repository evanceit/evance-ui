import {propsFactory} from "@/util";
import {makeTagProps} from "@/composables/tag.ts";
import {makeComponentProps} from "@/composables/component.ts";
import {makeGroupItemProps} from "@/composables/groupItem.ts";
import {makeRoundedProps} from "@/composables/rounded.ts";

export const makeEvTagProps = propsFactory({
    closable: Boolean,
    draggable: Boolean,
    link: {
        type: Boolean,
        default: undefined,
    },
    modelValue: {
        type: Boolean,
        default: true
    },
    text: String,

    ...makeGroupItemProps(),
    ...makeComponentProps(),
    ...makeRoundedProps(),
    ...makeTagProps()

}, 'EvTag');
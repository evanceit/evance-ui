import {propsFactory} from "@/util";
import {makeTagProps} from "@/composables/tag.ts";
import {makeComponentProps} from "@/composables/component.ts";
import {makeGroupItemProps} from "@/composables/group.ts";

export const makeEvTagProps = propsFactory({
    closable: Boolean,
    draggable: Boolean,
    modelValue: {
        type: Boolean,
        default: true
    },
    text: String,

    ...makeGroupItemProps(),
    ...makeComponentProps(),
    ...makeTagProps()

}, 'EvTag');
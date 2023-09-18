import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {PropType} from "vue";

export const makeEvErrorsProps = propsFactory({
    active: Boolean,
    messages: {
        type: [Array, String] as PropType<string | readonly string[]>,
        default: () => ([])
    },

    ...makeComponentProps()
}, 'EvErrors');
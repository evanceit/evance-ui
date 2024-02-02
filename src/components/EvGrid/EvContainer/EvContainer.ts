import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";

/**
 * # makeEvContainerProps
 */
export const makeEvContainerProps = propsFactory({
    fluid: {
        type: Boolean,
        default: false,
    },
    ...makeComponentProps()
}, 'EvContainer');
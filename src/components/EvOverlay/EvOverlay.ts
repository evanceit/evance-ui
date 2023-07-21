import {propsFactory} from "../../util";
import {PropType, TransitionProps} from "vue";
import {TeleportTarget} from "../../composables/teleport.ts";
import {makeTransitionProps} from "../../composables/transitions.ts";
import {makeDimensionsProps} from "../../composables/dimensions.ts";
import {makeActivatorProps} from "./activator.ts";

/**
 * # Make EvOverlay Props
 */
export const makeEvOverlayProps = propsFactory({
    attach: [Boolean, String, Object] as PropType<TeleportTarget>,
    closeOnBack: {
        type: Boolean,
        default: true
    },
    contained: Boolean,
    disabled: Boolean,
    modelValue: Boolean,
    persistent: Boolean,
    veil: {
        type: Boolean,
        default: true
    },
    zIndex: {
        type: [Number, String],
        default: 2000,
    },

    ...makeActivatorProps(),
    ...makeDimensionsProps(),
    ...makeTransitionProps()

}, 'EvOverlay');
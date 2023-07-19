import {propsFactory} from "../../util";
import {PropType, TransitionProps} from "vue";
import {TeleportTarget} from "../../composables/teleport.ts";
import {makeTransitionProps} from "../../composables/transitions.ts";
import {makeDimensionsProps} from "../../composables/dimensions.ts";

/**
 * # Make EvOverlay Props
 */
export const makeEvOverlayProps = propsFactory({
    attach: [Boolean, String, Object] as PropType<TeleportTarget>,
    contained: Boolean,
    disabled: Boolean,
    modelValue: Boolean,
    persistent: Boolean,
    veil: Boolean,

    ...makeDimensionsProps(),
    ...makeTransitionProps()

}, 'EvOverlay');
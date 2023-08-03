import {propsFactory} from "../../util";
import {PropType, StyleValue} from "vue";
import {TeleportTarget} from "../../composables/teleport.ts";
import {makeEvTransitionProps} from "../../composables/transitions.ts";
import {makeDimensionsProps} from "../../composables/dimensions.ts";
import {makeActivatorProps} from "./activator.ts";
import {makePositionStrategyProps} from "./position.ts";
import {makeScrollStrategyProps} from "./scroll.ts";

/**
 * # Make EvOverlay Props
 */
export const makeEvOverlayProps = propsFactory({
    attach: [Boolean, String, Object] as PropType<TeleportTarget>,
    class: [String, Array] as PropType<any>,
    closeOnBack: {
        type: Boolean,
        default: true
    },
    contained: Boolean,
    contentClass: null,
    contentProps: null,
    disabled: Boolean,
    modelValue: Boolean,
    persistent: Boolean,
    style: {
        type: [String, Array, Object] as PropType<StyleValue>,
        default: null,
    },
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
    ...makePositionStrategyProps(),
    ...makeScrollStrategyProps(),
    ...makeEvTransitionProps()

}, 'EvOverlay');
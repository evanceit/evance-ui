import {propsFactory} from "../../util";
import {Component, PropType, TransitionProps} from "vue";
import {TeleportTarget} from "../../composables/teleport.ts";

/**
 * # Make EvOverlay Props
 */
export const makeEvOverlayProps = propsFactory({
    attach: [Boolean, String, Object] as PropType<TeleportTarget>,
    contained: Boolean,
    disabled: Boolean,
    modelValue: Boolean,
    transition: {
        type: [Boolean, String, Object] as PropType<string | boolean | TransitionProps & { component?: Component }>,
        default: 'fade-transition',
        validator: (value) => {
            return (value !== true);
        }
    },
    veil: Boolean
}, 'EvOverlay');
import { propsFactory } from "@/util";
import { PropType, Ref } from "vue";
import { TeleportTarget } from "@/composables/teleport";
import { makeDimensionsProps } from "@/composables/dimensions";
import { makeActivatorProps } from "./activator";
import { makePositionStrategyProps } from "./position";
import { makeScrollStrategyProps } from "./scroll";
import { makeEvTransitionProps } from "@/components/EvTransition";
import { makeComponentProps } from "@/composables/component";

/**
 * # Make EvOverlay Props
 */
export const makeEvOverlayProps = propsFactory(
    {
        absolute: Boolean,
        attach: [Boolean, String, Object] as PropType<TeleportTarget>,
        closeOnBack: {
            type: Boolean,
            default: true,
        },
        contained: Boolean,
        contentClass: null,
        contentProps: null,
        disabled: Boolean,
        modelValue: [Boolean, Object] as PropType<ModelValueProp>,
        persistent: Boolean,
        veil: {
            type: Boolean,
            default: true,
        },
        zIndex: {
            type: [Number, String],
            default: 2000,
        },

        ...makeActivatorProps(),
        ...makeDimensionsProps(),
        ...makePositionStrategyProps(),
        ...makeScrollStrategyProps(),
        ...makeEvTransitionProps(),
        ...makeComponentProps(),
    },
    "EvOverlay",
);

type ModelValueProp = boolean | Ref<boolean>;

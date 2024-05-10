import { propsFactory } from "@/util";
import { PropType, Ref } from "vue";
import { TeleportTarget } from "@/composables/teleport.ts";
import { makeDimensionsProps } from "@/composables/dimensions.ts";
import { makeActivatorProps } from "./activator.ts";
import { makePositionStrategyProps } from "./position.ts";
import { makeScrollStrategyProps } from "./scroll.ts";
import { makeEvTransitionProps } from "@/components/EvTransition";
import { makeComponentProps } from "@/composables/component.ts";

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
